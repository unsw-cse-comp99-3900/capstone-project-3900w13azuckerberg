import unittest
from flask import Flask
from datetime import datetime
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from db_manager import init_db, get_case_by_coordinate
from model import db, VirusData, LabLocation, StrainLabel

class DBManagerTestCase1(unittest.TestCase):
    def setUp(self):
        # Create a Flask application configured for testing
        self.app = Flask(__name__)
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.app.config['TESTING'] = True
        init_db(self.app)
        
        # Create the database and tables
        with self.app.app_context():
            db.create_all()

            # Insert test data
            self.insert_test_data()

    def tearDown(self):
        # Drop the database
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


if __name__ == '__main__':
    unittest.main()
