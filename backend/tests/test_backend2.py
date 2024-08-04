import unittest
import sys
import os
from flask import Flask
from flask.testing import FlaskClient
from datetime import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from db_manager import init_db,get_case_by_coordinate
from app import app
from model import db, VirusData, LabLocation, StrainLabel

class FlaskAppTests(unittest.TestCase):
    def setUp(self):
        """Set up the test environment before each test."""
        self.app = app
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.app.config['TESTING'] = True
        # init_db(self.app)

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
            id='1', date=datetime.strptime('2024-06-01', '%Y-%m-%d'),
            lineage='B.1.1.7', strain='Alpha', division='Test Division', location='Test Location',
            region_exposure='Test Region', country_exposure='Test Country', division_exposure='New South Wales',
            age=30, sex='M', originating_lab='1', submitting_lab='Test Submitting Lab',
            date_submitted=datetime.strptime('2024-06-01', '%Y-%m-%d')
        )
        virus_data2 = VirusData(
            id='2', date=datetime.strptime('2024-06-01', '%Y-%m-%d'),
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
            date = datetime.strptime('2024-06-01', '%Y-%m-%d')
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
        print(data)
        self.assertIsInstance(data, dict)
    

if __name__ == '__main__':
    unittest.main()