# db_manager.py
from datetime import timedelta
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from model import db, VirusData, LabLocation

def init_db(app):
    """
    Initialize the database with the given Flask app.
    This function binds the Flask app with the SQLAlchemy instance.

    Args:
        app (Flask): The Flask application instance
    """
    db.init_app(app)
    with app.app_context():
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

def get_case_by_loc(date):
    start_date = date - timedelta(days=14)

    # Query to get the count of entries grouped by originating_lab
    results = db.session.query(
        VirusData.originating_lab,
        func.count(VirusData.id).label('case_count')
    ).filter(
        VirusData.date.between(start_date, date)
    ).group_by(
        VirusData.originating_lab
    ).all()

    result_dict = {originating_lab: case_count for originating_lab, case_count in results}
    return result_dict

def get_case_by_coordinate(date):
    start_date = date - timedelta(days=14)

    results = db.session.query(
        VirusData.originating_lab,
        func.count(VirusData.id).label('case_count'),
        LabLocation.longitude,
        LabLocation.latitude
    ).join(
        LabLocation, VirusData.originating_lab == LabLocation.id
    ).filter(
        VirusData.date.between(start_date, date)
    ).group_by(
        VirusData.originating_lab,
        LabLocation.longitude,
        LabLocation.latitude
    ).all()

    result_dict = {
        originating_lab: {
            'case_count': case_count,
            'longitude': longitude,
            'latitude': latitude
        } for originating_lab, case_count, longitude, latitude in results
    }
    return result_dict

def get_case_by_strain(date, strains):
    start_date = date - timedelta(days=14)

    # Query to get the count of entries grouped by location and strain
    results = db.session.query(
        VirusData.location,
        VirusData.strain,
        func.count(VirusData.id).label('case_count')
    ).filter(
        VirusData.date.between(start_date, date),
        VirusData.strain.in_(strains)
    ).group_by(
        VirusData.location,
        VirusData.strain
    ).all()

    result_dict = {}
    for location, strain, case_count in results:
        if location not in result_dict:
            result_dict[location] = {}
        result_dict[location][strain] = case_count

    return result_dict

if __name__ == '__main__':
    ...