# build database from eurostat.csv


import sqlite3
import pandas as pd

db = sqlite3.connect('./data/data.db')
df = pd.read_csv('./data/eurostat.csv')
df.to_sql('data', db)
db.close()
