from db_manager import db

class VirusData(db.Model):
    __tablename__ = 'virus_data'
    
    strain = db.Column(db.String, nullable=False)
    virus = db.Column(db.String, nullable=False)
    segment = db.Column(db.String, nullable=False)
    length = db.Column(db.Integer, nullable=False)
    gisaid_epi_isl = db.Column(db.String, nullable=False, primary_key=True)
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
