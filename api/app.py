from flask import Flask, request, jsonify
import sqlite3
import pandas as pd

app = Flask(__name__)


@app.route('/')
def home():
    return '<h1>Eurostat</h1>'
@app.route('/countries')
def list_of_countries():
    db = sqlite3.connect('data.db')
    cursor = db.cursor()
    query = 'SELECT DISTINCT DECLARANT_ISO FROM data'
    result = [item[0] for item in cursor.execute(query).fetchall()]
    db.close()
    return jsonify(result)


@app.route('/data/<country_code>/<trade_type>')
def country(country_code, trade_type):

    db = sqlite3.connect('data.db')

    sql_query = 'SELECT PERIOD, SUM(VALUE_EUR) total FROM data  WHERE DECLARANT_ISO=? and TRADE_TYPE=? and PERIOD NOT LIKE "%52" GROUP BY PERIOD ORDER BY PERIOD'
    cc = country_code.upper()
    tt = trade_type.upper()
    df = pd.read_sql_query(sql_query, db, params=[cc, tt])

    value = df['total']
    df['MA12'] = value.rolling(12).mean()
    df['MOM'] = value.pct_change()*100
    df['YOY'] = value.pct_change(12)*100

    db.close()
    retJson = df.to_json(orient='records')
    return retJson


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
