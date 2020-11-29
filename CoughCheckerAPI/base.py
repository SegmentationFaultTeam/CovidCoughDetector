from flask import Flask
import redis
import pymysql
from flask_cors import *
import joblib

from config import MYSQL_HOST, MYSQL_DBNAME, MYSQL_PASSWD, MYSQL_USER, REDIS_HOST, REDIS_PORT

app = Flask(__name__)
CORS(app,support_credentials=True)

redis_cursor = redis.Redis(REDIS_HOST, REDIS_PORT)

sql_conn = pymysql.connect(
    host=MYSQL_HOST,
    user=MYSQL_USER,
    password=MYSQL_PASSWD,
    database=MYSQL_DBNAME,
    charset="utf8")

sql_cursor = sql_conn.cursor()

clf=joblib.load('./cough_svm.pkl')