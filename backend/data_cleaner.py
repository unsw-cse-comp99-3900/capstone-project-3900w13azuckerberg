# data_cleaner.py
import pandas as pd
import os
from gmaps import get_coordinates

DATA_PATH = 'raw_data/covid_data'  # The path of dir containing all raw data

# Given a dataframe of COVID tests data, perform the data cleaning.
def virus_data_cleaning(data):
     # Renaming columns
    data.rename(columns={'pangolin_lineage': 'lineage'}, inplace=True)
    data.rename(columns={'gisaid_epi_isl': 'id'}, inplace=True)

    # Filter
    data = data.dropna(subset=['originating_lab'])
    data = data[(data['region'] == 'Oceania') & (data['country'] == 'Australia')]
    data = data[data['host'] == 'Human']
    data[['age', 'sex']] = data[['age', 'sex']].replace('unknown', pd.NA)
    data = data[data['lineage'] != 'Unassigned']
    data = data[data['originating_lab'] != 'unknown']

    # Replace incorrect lab names
    prefix = 'Microbiological Diagnostic Unit'
    data['originating_lab'] = data['originating_lab'].apply(
        lambda x: "The Peter Doherty Institute for Infection and Immunity" if x.startswith(prefix) else x
    )

    # Function to extract substring before the second '.'
    def extract_lineage_prefix(s):
        parts = s.split('.')
        if len(parts) > 2:
            return '.'.join(parts[:2])
        return s

    # Apply the function to the pangolin_lineage column
    data['strain'] = data['lineage'].apply(extract_lineage_prefix)

    def extract_id(s):
        return s.split('_')[-1]

    # Apply the function to the gisaid_epi_isl column
    data['id'] = data['id'].apply(extract_id)

    # List of columns to keep
    columns_to_keep = [
        # virus
        'id', 'lineage', 'strain', 'date',
        # location
        'division', 'location',
        # exposure
        'region_exposure', 'country_exposure', 'division_exposure',
        # patient
        'age', 'sex',
        # submission
        'originating_lab', 'submitting_lab', 'date_submitted'
    ]

    # Keep only the specified columns
    data = data.loc[:, columns_to_keep]

    # Change data type

    # Convert to datetime using the specified formats
    def parse_dates(date_series):
        date_formats = ["%d/%m/%Y", "%Y-%m-%d"]
        for fmt in date_formats:
            parsed_dates = pd.to_datetime(date_series, format=fmt, errors='coerce')
            if parsed_dates.notna().all():
                return parsed_dates
        return pd.to_datetime(date_series, errors='coerce')

    data['date'] = parse_dates(data['date'])
    data = data.dropna(subset=['date'])
    data['date_submitted'] = parse_dates(data['date_submitted'])

    data['age'] = pd.to_numeric(data['age'], errors='coerce')


    return data

# Load all tsv files into a single dataframe.
def clean_all_virus_data():
    dataframes = []

    # Loop through all files in the directory
    for file_name in os.listdir(DATA_PATH):
        # Check if the file is a TSV file
        if file_name.endswith('.tsv'):
            # Read the TSV file into a DataFrame
            file_path = os.path.join(DATA_PATH, file_name)
            df = pd.read_csv(file_path, sep='\t')
            # Append the DataFrame to the list
            try:
                dataframes.append(virus_data_cleaning(df))
            except Exception as e:
                print(f"Error in loading {file_name}\n{e}")

    data = pd.concat(dataframes, ignore_index=True)

    return data

def get_lab_df(df):
    unique_labs = df['originating_lab'].unique()
    lab_df = pd.DataFrame({
        'id': range(1, len(unique_labs) + 1),
        'lab_name': unique_labs
    })

    # Initialize empty lists for latitudes and longitudes
    latitudes = []
    longitudes = []

    # Get coordinates for each unique originating_lab and append to lists
    for lab in lab_df['lab_name']:
        coords = get_coordinates(lab)
        latitudes.append(coords['latitude'])
        longitudes.append(coords['longitude'])

    # Assign the lists to the new_labs_df DataFrame
    lab_df['latitude'] = latitudes
    lab_df['longitude'] = longitudes

    lab_df = lab_df[(lab_df['latitude'] != 'Invalid location') & (lab_df['longitude'] != 'Invalid location')]

    return lab_df


def clean_virus_data_after_lab(df, lab_df):
    lab_id_map = lab_df.set_index('lab_name')['id'].to_dict()

    df['originating_lab'] = df['originating_lab'].map(lab_id_map)

    df = df.dropna(subset=['originating_lab'])

    return df

if __name__ == '__main__':
    df = clean_all_virus_data()
    lab_df = get_lab_df(df)
    df = clean_virus_data_after_lab(df, lab_df)
    # print(df.head)
    # print(lab_df)
    df.to_parquet('covid_data.parquet', index=False)
    lab_df.to_parquet('lab_location.parquet', index=False)

# putting df in csv
    cleaned_data = clean_all_virus_data()
    cleaned_data.to_csv('cleaned_data.csv', index=False)
    print("Data cleaned and saved to cleaned_data.csv")


def get_lab_df(df):
    unique_labs = df['originating_lab'].unique()
    lab_df = pd.DataFrame({
        'id': range(1, len(unique_labs) + 1),
        'lab_name': unique_labs
    })

    # Initialize empty lists for latitudes and longitudes
    latitudes = []
    longitudes = []

    # Get coordinates for each unique originating_lab and append to lists
    for lab in lab_df['lab_name']:
        coords = get_coordinates(lab)
        latitudes.append(coords['latitude'])
        longitudes.append(coords['longitude'])

    # Assign the lists to the new_labs_df DataFrame
    lab_df['latitude'] = latitudes
    lab_df['longitude'] = longitudes

    lab_df = lab_df[(lab_df['latitude'] != 'Invalid location') & (lab_df['longitude'] != 'Invalid location')]

    return lab_df


def clean_virus_data_after_lab(df, lab_df):
    lab_id_map = lab_df.set_index('lab_name')['id'].to_dict()

    df['originating_lab'] = df['originating_lab'].map(lab_id_map)

    df = df.dropna(subset=['originating_lab'])

    return df

if __name__ == '__main__':
    df = clean_all_virus_data()
    lab_df = get_lab_df(df)
    df = clean_virus_data_after_lab(df, lab_df)
    # print(df.head)
    # print(lab_df)
    df.to_parquet('covid_data.parquet', index=False)
    lab_df.to_parquet('lab_location.parquet', index=False)
    
    # putting df in csv
    cleaned_data = clean_all_virus_data()
    cleaned_data.to_csv('cleaned_data.csv', index=False)
    print("Data cleaned and saved to cleaned_data.csv")