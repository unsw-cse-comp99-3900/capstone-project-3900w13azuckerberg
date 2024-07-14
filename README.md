# COVID Compass: Modelling the Interplay of COVID-19 Variants in Australia

## Overview

This project aims to develop a comprehensive system to understand and predict the interplay of different COVID-19 variants in Australia. Utilizing the SEIRS-V model, the project focuses on analyzing the spread, mutation rates, and impact of various COVID-19 variants. The system will provide valuable insights to inform public health strategies and interventions.

## Project Structure

### Frontend

- **Data Visualization**: Interactive dashboards and visualizations.
- **Data Acquisition Interface**: Interface for collecting and displaying data.
- **Frontend Technologies**: Built with React.

### Backend

- **Server**: Handles requests and serves the frontend.
- **Backend Logic**: Manages data processing and model integration.
- **SEIRS-V Model**: Simulates the local dynamics of COVID-19 spread.
- **Random Network**: Supports the SEIRS-V model in simulating network interactions.
- **Database Management**: PostgreSQL for data storage and querying.
- **Backend Technologies**: Built with Flask.

### Data Processing

- **Data Extraction**: Import data from various sources/APIs.
- **Data Cleaning**: Preprocess and integrate data.
- **DB Manager**: Manages and manipulates the database.

### Folder Structure:

```
/project-root
    /backend
        /migrations
        app.py
        (other backend files)
    /frontend
        /src (your React app files)
        package.json
        package-lock.json
    .gitignore
    README.md
```

## Key Features

- **Variant Interaction Analysis**: Study interactions between different COVID-19 variants.
- **Interactive Visualizations**: Graphical representations of model outputs, trends, and predictions.
- **Comprehensive Data Handling**: From data acquisition to visualization.

## Technologies

- **Python (Flask)**: Data processing and backend development.
- **JavaScript (React)**: Frontend development.
- **PostgreSQL**: Database management.
