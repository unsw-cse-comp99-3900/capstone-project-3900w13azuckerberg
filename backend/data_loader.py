import pandas as pd
from app import app
from data_cleaner import clean_all_virus_data
from db_manager import load_dataframe_to_db
from gmaps import get_coordinates

with app.app_context():
    df = clean_all_virus_data()

    unique_labs = df['originating_lab'].unique()
    new_labs_df = pd.DataFrame({
        'id': range(1, len(unique_labs) + 1),
        'lab_name': unique_labs
    })

    # Initialize empty lists for latitudes and longitudes
    latitudes = []
    longitudes = []

    # Get coordinates for each unique originating_lab and append to lists
    for lab in new_labs_df['lab_name']:
        coords = get_coordinates(lab)
        latitudes.append(coords['latitude'])
        longitudes.append(coords['longitude'])

    # Assign the lists to the new_labs_df DataFrame
    new_labs_df['latitude'] = latitudes
    new_labs_df['longitude'] = longitudes

    print(new_labs_df)

    lab_id_map = new_labs_df.set_index('lab_name')['id'].to_dict()

    # Replace originating_lab in the old DataFrame with the new IDs
    df['originating_lab'] = df['originating_lab'].map(lab_id_map)

    # Load into DB
    load_dataframe_to_db(df, "virus_data", app)
    load_dataframe_to_db(new_labs_df, "lab_location", app)
