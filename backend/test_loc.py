from db_manager import get_case_by_loc
from model import VirusData
from datetime import datetime, timedelta

current_date = datetime.strptime('2024-4-30', '%Y-%m-%d').date()
loc_data = get_case_by_loc(VirusData, current_date)

print(loc_data)