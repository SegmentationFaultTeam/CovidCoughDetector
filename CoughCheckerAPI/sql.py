from base import sql_cursor,sql_conn
from builtins import *


def add_check_record(id,name,rate):
    sentence="insert into check_record (user_id,name,covid_rate) values ('{0}','{1}',{2});".format(id,name,str(rate))
    print(sentence)
    sql_cursor.execute(sentence)
    sql_conn.commit()