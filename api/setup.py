# build database from eurostat.csv


import sqlite3
import pandas as pd

db = sqlite3.connect('data.db')
df = pd.read_csv('https://s3-eu-west-1.amazonaws.com/logindex-dev-temp/data/eurostat.csv')
df.to_sql('data', db)
db.close()
