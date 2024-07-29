import pandas as pd
from db_manager import load_dataframe_to_db

def load_into_db(app):
    df = pd.read_parquet('raw_data/covid_data.parquet')
    lab_df = pd.read_parquet('raw_data/lab_location_cleaned.parquet')
    strain_df = pd.read_csv('raw_data/full_lineage_label.csv')
    load_dataframe_to_db(df, "virus_data", app)
    load_dataframe_to_db(lab_df, "lab_location", app)
    load_dataframe_to_db(strain_df, "strain_label", app)

def load_policy():
    df = pd.read_csv('raw_data/policy.csv')
    dict_result = df.groupby('Date').apply(lambda x: x.to_dict(orient='records')).to_dict()
    return dict_result

if __name__ == '__main__':
    from app import app
    with app.app_context():
        load_into_db(app)
