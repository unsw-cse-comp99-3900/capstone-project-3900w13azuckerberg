from db_manager import db

class VirusData(db.Model):
    __tablename__ = 'virus_data'
    
    id = db.Column(db.String, nullable=False, primary_key=True)
    lineage = db.Column(db.String, nullable=False)
    strain = db.Column(db.String, nullable=False)
    date = db.Column(db.Date, nullable=False)
    division = db.Column(db.String, nullable=True)
    location = db.Column(db.String, nullable=True)
    region_exposure = db.Column(db.String, nullable=False)
    country_exposure = db.Column(db.String, nullable=False)
    division_exposure = db.Column(db.String, nullable=True)
    age = db.Column(db.Integer, nullable=True)
    sex = db.Column(db.String, nullable=True)
    originating_lab = db.Column(db.String, db.ForeignKey('lab_location.id'), nullable=False)
    submitting_lab = db.Column(db.String, nullable=False)
    date_submitted = db.Column(db.Date, nullable=False)

class LabLocation(db.Model):
    __tablename__ = 'lab_location'

    id = db.Column(db.String, nullable=False, primary_key=True)
    lab_name = db.Column(db.String, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
