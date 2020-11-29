from flask import request
import hashlib
import redis
import librosa

from sql import *
from base import app,clf,redis_cursor
from util import *
from algorithm import predict
import haface


@app.route('/v1/test',methods=['GET'])
def test_api():
    return commonResponse(200,"helloworld")


@app.route('/v1/check/cough',methods=['POST'])
def check_cough_api():
    output={'rate':-100}

    cough_file=request.files.get('cough')
    if not cough_file:
        return commonResponse(400,"Cough File Not Found")

    cough_file_name=generate_random_hash()+'.mp3'
    cough_file_path='./static/'+cough_file_name
    with open(cough_file_path,'wb') as f:
        f.write(cough_file.read())
        f.close()

    stream,sr=librosa.load(cough_file_path,sr=None)
    try:
        output['rate'] = predict(stream,clf)*100
    except IOError:     #整段音频振幅全部低于门限值，无法检测到咳嗽声
        return commonResponse(400,"Please Cough More Heavy")
    if output['rate']<0:
        return commonResponse(400,"Please Cough More Times")

    cough_token = generate_random_hash()
    redis_cursor.set(cough_token,output['rate'])
    return commonResponse(200,str(output),{'coughtoken':cough_token})


@app.route('/v1/check/figure',methods=['POST'])
def check_figure_api():
    output = {'id': 'Null', 'name': 'Null','rate':'Null'}

    cough_token=request.headers.get('coughtoken')
    if not cough_token:
        return commonResponse(400,"Cough Token Header Not Found")
    covid_rate=redis_cursor.get(cough_token)
    if not covid_rate:
        return commonResponse(400,"Covid Rate Not Found")
    output['rate']=covid_rate.decode()

    figure_file = request.files.get('figure')
    if not figure_file:
        return commonResponse(400,"Figure File Not Found")

    figure_file_name = generate_random_hash() + '.jpg'
    figure_file_path = './static/' + figure_file_name
    with open(figure_file_path, 'wb') as f:
        f.write(figure_file.read())
        f.close()

    figure_img = haface.cv_imread(figure_file_path)
    try:
        output['id'], output['name'] = haface.query(figure_img)
    except ValueError:
        return commonResponse(400, "Identity Not Found")
    except IOError:
        return commonResponse(400, "Figure File Size Error")

    add_check_record(output['id'],output['name'],output['rate'])
    return commonResponse(200,str(output))