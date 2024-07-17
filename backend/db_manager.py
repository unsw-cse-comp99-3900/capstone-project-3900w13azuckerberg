# db_manager.py
from datetime import timedelta
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from model import db, VirusData, LabLocation, StrainLabel

def init_db(app):
    """
    Initialize the database with the given Flask app.
    This function binds the Flask app with the SQLAlchemy instance.

    Args:
        app (Flask): The Flask application instance
    """
    db.init_app(app)
    with app.app_context():
        db.drop_all()
        db.create_all()
        print("Database initialized successfully.")

def load_dataframe_to_db(dataframe, table_name, app):
    """
    Load a DataFrame into the database.

    Args:
        dataframe (pd.DataFrame): The DataFrame to load.
        table_name (str): The name of the table to load data into.
        app (Flask): The Flask application instance.
    """
    with app.app_context():
        try:
            dataframe.to_sql(table_name, db.engine, if_exists='replace', index=False)
            print(f"Data loaded successfully into {table_name} table.")
        except SQLAlchemyError as e:
            print(f"Error loading data: {e}")

def get_records(model, lim=0):
    """
    Query all records from a given model.

    Args:
        model (db.Model): The model to query.

    Returns:
        List of records.
    """
    try:
        if lim:
            records = model.query.limit(lim).all()
        else:
            records = model.query.all()
        return records
    except SQLAlchemyError as e:
        print(f"Error querying records: {e}")
        return []

def get_case_by_coordinate(date, labels = []):
    """Get case number for each lab location given a date

    Args:
        date (datetime)
        strains (array of string) - the strains you want to filter

    Returns:
        A dict of following format
        originating_lab: {
            'longitude',
            'latitude',
            'case_count',
            'state'
        }
    """
    start_date = date - timedelta(days=14)

    query = db.session.query(
        VirusData.originating_lab,
        LabLocation.longitude,
        LabLocation.latitude,
        func.count(VirusData.id).label('case_count'),
        VirusData.division_exposure
    ).join(
        LabLocation, VirusData.originating_lab == LabLocation.id
    ).join(
        StrainLabel, VirusData.lineage == StrainLabel.lineage
    ).filter(
        VirusData.date.between(start_date, date)
    )

    if labels:
        query = query.filter(StrainLabel.label.in_(labels))

    query = query.group_by(
        VirusData.originating_lab,
        LabLocation.longitude,
        LabLocation.latitude,
        VirusData.division_exposure
    )

    results = query.all()

    result_dict = {}
    for originating_lab, longitude, latitude, case_count, division_exposure in results:
        if originating_lab not in result_dict:
            result_dict[originating_lab] = {
                'longitude': longitude,
                'latitude': latitude,
                'case_count': case_count,
                'state': division_exposure
            }
    return result_dict

def get_case_by_coordinate_and_strain(date, strains=[]):
    """Get case number for each lab location given a date

    Args:
        date (datetime)

    Returns:
        A dict of following format
        originating_lab: {
            'longitude',
            'latitude',
            'case_count',
            'state'
        }
    """
    start_date = date - timedelta(days=14)

    results = db.session.query(
        VirusData.originating_lab,
        LabLocation.longitude,
        LabLocation.latitude,
        StrainLabel.label,
        func.count(VirusData.id).label('case_count'),
        VirusData.division_exposure
    ).join(
        LabLocation, VirusData.originating_lab == LabLocation.id
    ).join(
        StrainLabel, VirusData.lineage == StrainLabel.lineage
    ).filter(
        VirusData.date.between(start_date, date)
    ).group_by(
        VirusData.originating_lab,
        LabLocation.longitude,
        LabLocation.latitude,
        StrainLabel.label,
        VirusData.division_exposure
    ).all()

    result_dict = {}
    for originating_lab, longitude, latitude, label, case_count, division_exposure in results:
        if originating_lab not in result_dict:
            result_dict[originating_lab] = {
                'longitude': longitude,
                'latitude': latitude,
                'case_count': case_count,
                'state': division_exposure
            }
        # result_dict[originating_lab]['case_count'][label] = case_count

    return result_dict

def get_all_time_case_pie_chart():
        # Fetch all the data
    results = db.session.query(
        VirusData.date,
        VirusData.division_exposure,
        StrainLabel.label,
        func.count(VirusData.id).label('case_count')
    ).join(
        LabLocation, VirusData.originating_lab == LabLocation.id
    ).join(
        StrainLabel, VirusData.lineage == StrainLabel.lineage
    ).group_by(
        VirusData.date,
        VirusData.division_exposure,
        StrainLabel.label
    ).order_by(
        VirusData.date
    ).all()

    # Organize results into a dictionary for easier cumulative sum calculation
    temp_result_dict = {}
    for date, division_exposure, label, case_count in results:
        date_str = date.strftime("%Y-%m-%d")
        division_exposure = division_exposure or "Unknown"  # Handle None values for division_exposure
        label = label or "Unknown"  # Handle None values for label
        if date_str and date_str not in temp_result_dict:
            temp_result_dict[date_str] = {}
        if division_exposure and division_exposure not in temp_result_dict[date_str]:
            temp_result_dict[date_str][division_exposure] = {}
        if label and label not in temp_result_dict[date_str][division_exposure]:
            temp_result_dict[date_str][division_exposure][label] = 0
        temp_result_dict[date_str][division_exposure][label] += case_count

    # Calculate the cumulative sum for each date over the past 14 days
    result_dict = {}
    sorted_dates = sorted(temp_result_dict.keys())
    for i, date_str in enumerate(sorted_dates):
        result_dict[date_str] = {}
        for division_exposure in temp_result_dict[date_str]:
            result_dict[date_str][division_exposure] = {}
            for label in temp_result_dict[date_str][division_exposure]:
                cumulative_sum = 0
                for j in range(max(0, i-13), i+1):  # Consider the past 14 days including the current day
                    prev_date_str = sorted_dates[j]
                    if division_exposure in temp_result_dict[prev_date_str] and label in temp_result_dict[prev_date_str][division_exposure]:
                        cumulative_sum += temp_result_dict[prev_date_str][division_exposure][label]
                result_dict[date_str][division_exposure][label] = cumulative_sum

    return result_dict


if __name__ == '__main__':
    ...