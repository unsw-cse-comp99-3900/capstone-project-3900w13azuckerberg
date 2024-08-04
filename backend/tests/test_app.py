import unittest
import sys
import os
from flask import Flask
from flask.testing import FlaskClient
from datetime import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from db_manager import init_db,get_case_by_coordinate, get_all_case_by_coordinate
from app import app
from model import db, VirusData, LabLocation, StrainLabel


class FlaskAppTests(unittest.TestCase):
    def setUp(self):
        """Set up the test environment before each test."""
        self.app = app
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.app.config['TESTING'] = True

        # Initialize the database for testing
        with self.app.app_context():
            db.create_all()

            self.insert_test_data()

        self.client = app.test_client()
    
    def tearDown(self):
        """Clean up after each test."""
        with self.app.app_context():
            db.session.remove()
            db.drop_all()
        

    def insert_test_data(self):
        # Insert test data into the database
        lab1 = LabLocation(id='1', lab_name='Test Lab1', latitude=-33.8688, longitude=151.2093)
        lab2 = LabLocation(id='2', lab_name='Test Lab2', latitude=-28.0023731, longitude=153.4145987)
        strain1 = StrainLabel(lineage='B.1.1.7', label='Alpha')
        virus_data1 = VirusData(
            id='1', date=datetime.strptime('2024-03-01', '%Y-%m-%d'),
            lineage='B.1.1.7', strain='Alpha', division='Test Division', location='Test Location',
            region_exposure='Test Region', country_exposure='Test Country', division_exposure='New South Wales',
            age=30, sex='M', originating_lab='1', submitting_lab='Test Submitting Lab',
            date_submitted=datetime.strptime('2024-06-01', '%Y-%m-%d')
        )
        virus_data2 = VirusData(
            id='2', date=datetime.strptime('2024-03-01', '%Y-%m-%d'),
            lineage='B.1.1.7', strain='Alpha', division='Test Division', location='Test Location',
            region_exposure='Test Region', country_exposure='Test Country', division_exposure='Queensland',
            age=30, sex='M', originating_lab='2', submitting_lab='Test Submitting Lab',
            date_submitted=datetime.strptime('2024-06-01', '%Y-%m-%d')
        )
        db.session.add(lab1)
        db.session.add(lab2)
        db.session.add(strain1)
        db.session.add(virus_data1)
        db.session.add(virus_data2)
        db.session.commit()

    def test_get_case_by_coordinate(self):
        with self.app.app_context():
            date = datetime.strptime('2024-03-01', '%Y-%m-%d')
            results = get_case_by_coordinate(date, ['Alpha'])
            expected = {
                '1': {
                    'longitude': 151.2093,
                    'latitude': -33.8688,
                    'case_count': 1,
                    'state': 'New South Wales'
                },
                '2': {
                    'longitude': 153.4145987,
                    'latitude': -28.0023731,
                    'case_count': 1,
                    'state': 'Queensland'
                }
            }
            self.assertEqual(results, expected)
    
    def test_get_all_case_by_coordinate(self):
        with self.app.app_context():
            start_date = datetime.strptime('2024-03-01', '%Y-%m-%d').date()
            end_date = datetime.strptime('2024-03-01', '%Y-%m-%d').date()
            results = get_all_case_by_coordinate(start_date, end_date, ['Alpha'])

            expected = {
                "2024-03-01": [
                    {
                        "intensity": 1.0,
                        "latitude": -33.8688,
                        "longitude": 151.2093,
                        "state": "New South Wales"
                    },
                    {
                        "intensity": 1.0,
                        "latitude": -28.0023731,
                        "longitude": 153.4145987,
                        "state": "Queensland"
                    }
                ]
            }
            self.assertEqual(results, expected)


    def test_home(self):
        """Test the home route."""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Welcome to COVID Compass!', response.data)

    
    def test_heat_map(self):
        """Test the heat_map route."""
        response = self.client.get('/map?containerId=m')

        self.assertEqual(response.status_code, 200)
        data = response.json

        expected = {
            "2024-03-01": [
                {
                    "intensity": 1.0,
                    "latitude": -33.8688,
                    "longitude": 151.2093,
                    "state": "New South Wales"
                },
                {
                    "intensity": 1.0,
                    "latitude": -28.0023731,
                    "longitude": 153.4145987,
                    "state": "Queensland"
                }
            ]
        }

        self.assertEqual(data, expected)
    
    def test_predictive_map(self):
        """Test the predictive_map route, data is predicted and cannot be asserted"""
        response = self.client.get('/predictive_map?containerId=left')
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertIsInstance(data, dict)
    
    def test_filter_variant(self):
        """Test the filter_variant route."""
        response = self.client.get('/filter?label=Alpha&selected=true&containerId=left')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'success', response.data)

    def test_select_policy(self):
        """Test the select_policy route."""
        response = self.client.get('/policies?state=New South Wales&startDate=2024-05-30&endDate=2024-09-30&policy=Social Distancing&containerId=left')
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertIsInstance(data, dict)

    def test_delete_policy(self):
        """Test the delete_policy route."""
        response = self.client.get('/delete_policy?state=New South Wales&containerId=left')
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertIsInstance(data, dict)

    def test_charts(self):
        """Test the variant_pie_chart route."""
        response = self.client.get('/graphdata?containerId=left')
        self.assertEqual(response.status_code, 200)
        data = response.json

        expected = {
            '2024-03-01': {
                'Australia': {
                    'Alpha': 2, 'Beta': 0, 'Delta': 0, 'Gamma': 0, 'Omicron': 0
                }, 
                'Australian Capital Territory': {
                    'Alpha': 0, 'Beta': 0, 'Delta': 0, 'Gamma': 0, 'Omicron': 0
                },
                'New South Wales': {
                    'Alpha': 1, 'Beta': 0, 'Delta': 0, 'Gamma': 0, 'Omicron': 0
                }, 
                'Northern Territory': {
                    'Alpha': 0, 'Beta': 0, 'Delta': 0, 'Gamma': 0, 'Omicron': 0
                }, 
                'Queensland': {
                    'Alpha': 1, 'Beta': 0, 'Delta': 0, 'Gamma': 0, 'Omicron': 0
                }, 
                'South Australia': {
                    'Alpha': 0, 'Beta': 0, 'Delta': 0, 'Gamma': 0, 'Omicron': 0
                }, 
                'Tasmania': {
                    'Alpha': 0, 'Beta': 0, 'Delta': 0, 'Gamma': 0, 'Omicron': 0
                }, 
                'Victoria': {
                    'Alpha': 0, 'Beta': 0, 'Delta': 0, 'Gamma': 0, 'Omicron': 0
                }, 
                'Western Australia': {
                    'Alpha': 0, 'Beta': 0, 'Delta': 0, 'Gamma': 0, 'Omicron': 0
                }
            }
        }
        self.assertEqual(data, expected)

        def test_SEIRS_data(self):
            """Test the SEIRS_data route."""
            response = self.client.get('/SEIRS_data')
            self.assertEqual(response.status_code, 200)
            data = response.json

            expected = {
                "2024-03-01":[
                    {"intensity":1.0,"latitude":-33.8688,"longitude":151.2093,"state":"New South Wales"},
                    {"intensity":1.0,"latitude":-28.0023731,"longitude":153.4145987,"state":"Queensland"}
                ]
            }
            self.assetEqual(data, expected)
            self.assertIsInstance(data, dict)



if __name__ == '__main__':
    unittest.main()