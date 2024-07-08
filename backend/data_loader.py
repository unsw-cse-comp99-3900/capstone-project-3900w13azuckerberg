from app import app
from data_cleaner import clean_all_virus_data
from db_manager import load_dataframe_to_db

with app.app_context():
    load_dataframe_to_db(clean_all_virus_data(), "virus_data", app)