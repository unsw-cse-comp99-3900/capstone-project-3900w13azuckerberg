# db_manager.py
from datetime import timedelta
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from data_cleaner import clean_all_virus_data

db = SQLAlchemy()

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

def add_record(record):
    """
    Add a single record to the database.

    Args:
        record (db.Model): The record to add.
    """
    try:
        db.session.add(record)
        db.session.commit()
        print("Record added successfully.")
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Error adding record: {e}")

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

def update_record(record):
    """
    Update an existing record in the database.

    Args:
        record (db.Model): The record to update.
    """
    try:
        db.session.commit()
        print("Record updated successfully.")
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Error updating record: {e}")

def delete_record(record):
    """
    Delete a single record from the database.

    Args:
        record (db.Model): The record to delete.
    """
    try:
        db.session.delete(record)
        db.session.commit()
        print("Record deleted successfully.")
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Error deleting record: {e}")


def get_case_by_loc(model, date, selected_strains):
    start_date = date - timedelta(days=14)

    # Query to get the count of entries grouped by originating_lab
    results = db.session.query(
        model.originating_lab,
        func.count(model.id).label('case_count')
    ).filter(
        model.date.between(start_date, date)
    ).group_by(
        model.originating_lab
    ).all()

    result_dict = {originating_lab: case_count for originating_lab, case_count in results}
    return result_dict
