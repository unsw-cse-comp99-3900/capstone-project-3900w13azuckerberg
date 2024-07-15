import pandas as pd
from db_manager import load_dataframe_to_db

def load_into_db(app):
    df = pd.read_parquet('raw_data/covid_data.parquet')
    lab_df = pd.read_parquet('raw_data/lab_location.parquet')
    load_dataframe_to_db(df, "virus_data", app)
    load_dataframe_to_db(lab_df, "lab_location", app)

if __name__ == '__main__':
    from app import app
    with app.app_context():
        # df = clean_all_virus_data()
        # lab_df = get_lab_df(df)
        # df = clean_virus_data_after_lab(df, lab_df)

        df = pd.read_parquet('raw_data/covid_data.parquet')
        lab_df = pd.read_parquet('raw_data/lab_location.parquet')
        # Load into DB
        load_dataframe_to_db(df, "virus_data", app)
        load_dataframe_to_db(lab_df, "lab_location", app)
