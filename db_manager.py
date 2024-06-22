# db_manager.py
from flask_sqlalchemy import SQLAlchemy
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
        # load_dataframe_to_db(clean_all_virus_data(), "virus_data", app)
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