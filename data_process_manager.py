import pandas as pd
import os

DATA_PATH = 'raw_data'

# Given a dataframe of COVID tests data, perform the data cleaning.
def covid_tests_data_cleaning(data):
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
    data['date'] = pd.to_datetime(data['date'])
    data['date_submitted'] = pd.to_datetime(data['date_submitted'])
    data['age'] = pd.to_numeric(data['age'], errors='coerce')

    return data

# Load all tsv files into a single dataframe.
def load_and_clean_all_covid_data():
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
                dataframes.append(covid_tests_data_cleaning(df))
            except Exception as e:
                print(f"Error in loading {file_name}\n{e}")

    data = pd.concat(dataframes, ignore_index=True)

    return data