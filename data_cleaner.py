# data_cleaner.py
import pandas as pd
import os

DATA_PATH = 'raw_data'  # The path of dir containing all raw data

# Given a dataframe of COVID tests data, perform the data cleaning.
def virus_data_cleaning(data):
    # Filter
    data = data[(data['region'] == 'Oceania') & (data['country'] == 'Australia')]
    data = data[data['host'] == 'Human']
    data[['age', 'sex']] = data[['age', 'sex']].replace('unknown', pd.NA)

    # List of columns to keep
    columns_to_keep = [
        # virus
        'strain', 'virus', 'segment', 'length', 'gisaid_epi_isl', 'date',
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
