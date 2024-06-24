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
    originating_lab = db.Column(db.String, nullable=True)
    submitting_lab = db.Column(db.String, nullable=False)
    date_submitted = db.Column(db.Date, nullable=False)
