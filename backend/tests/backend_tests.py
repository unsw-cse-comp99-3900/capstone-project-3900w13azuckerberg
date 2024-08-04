import unittest
import sys
import os
from flask import Flask
from flask.testing import FlaskClient
from datetime import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from db_manager import init_db
from testapp import app
from model import db, VirusData, LabLocation, StrainLabel

class FlaskAppTests(unittest.TestCase):
    def setUp(self):
        """Set up the test environment before each test."""
        self.app = app
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.app.config['TESTING'] = True
        init_db(self.app)

        self.client = app.test_client()

        # Initialize the database for testing
        with self.app.app_context():
            db.create_all()

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


    def test_home(self):
        """Test the home route."""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Welcome to COVID Compass!', response.data)

    # def test_load_data(self):
    #     """Test the load_data route."""
    #     response = self.client.get('/load_data')
    #     self.assertEqual(response.status_code, 302)
    #     self.assertIn('/', response.location)

    # def test_heat_map(self):
    #     """Test the heat_map route."""
    #     response = self.client.get('/map?containerId=left')
    #     self.assertEqual(response.status_code, 200)
    #     data = response.json
    #     self.assertIsInstance(data, dict)

    # def test_predictive_map(self):
    #     """Test the predictive_map route."""
    #     response = self.client.get('/predictive_map?containerId=left')
    #     self.assertEqual(response.status_code, 200)
    #     data = response.json
    #     self.assertIsInstance(data, dict)

    # def test_filter_variant(self):
    #     """Test the filter_variant route."""
    #     response = self.client.get('/filter?label=Alpha&selected=true&containerId=left')
    #     self.assertEqual(response.status_code, 200)
    #     self.assertIn(b'success', response.data)

    # def test_select_policy(self):
    #     """Test the select_policy route."""
    #     response = self.client.get('/policies?state=New South Wales&startDate=2024-05-30&endDate=2024-09-30&policy=Social Distancing&containerId=left')
    #     self.assertEqual(response.status_code, 200)
    #     data = response.json
    #     self.assertIsInstance(data, dict)

    # def test_delete_policy(self):
    #     """Test the delete_policy route."""
    #     response = self.client.get('/delete_policy?state=New South Wales&containerId=left')
    #     self.assertEqual(response.status_code, 200)
    #     data = response.json
    #     self.assertIsInstance(data, dict)

    # def test_variant_pie_chart(self):
    #     """Test the variant_pie_chart route."""
    #     response = self.client.get('/graphdata?containerId=left')
    #     self.assertEqual(response.status_code, 200)
    #     data = response.json
    #     self.assertIsInstance(data, dict)

    # def test_SEIRS_data(self):
    #     """Test the SEIRS_data route."""
    #     response = self.client.get('/SEIRS_data')
    #     self.assertEqual(response.status_code, 200)
    #     data = response.json
    #     self.assertIsInstance(data, dict)

    # def test_predictive_graph(self):
    #     """Test the predictive_graph route."""
    #     response = self.client.get('/predictive_graphdata?containerId=left')
    #     self.assertEqual(response.status_code, 200)
    #     data = response.json
    #     self.assertIsInstance(data, dict)

if __name__ == '__main__':
    unittest.main()