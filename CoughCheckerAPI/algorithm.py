from builtins import *

import librosa
import matplotlib.pyplot as plt
import numpy as np
from sklearn.cluster import AffinityPropagation
from sklearn import svm
import glob
import joblib

def get_mfcc_feature(stream):
    return librosa.feature.mfcc(y=stream, n_mfcc=24).transpose().flatten().tolist()

def cut_cough_segment(origin_stream,threshold=0.70,layback=0.15):   #振幅门限取咳嗽段音频+AP聚类划分

    amplitude_start_process=0
    amplitude_end_process=0
    amplitude_start_list=[]

    for index in range(len(origin_stream)):
        if amplitude_start_process <= amplitude_end_process and origin_stream[index]>threshold:
            amplitude_start_process=index/len(origin_stream)
            amplitude_start_list.append(amplitude_start_process)
        if amplitude_end_process<amplitude_start_process and origin_stream[index]<0.05:
            amplitude_end_process=index/len(origin_stream)

    print(amplitude_start_list)

    if not amplitude_start_list:
        raise IOError("Over Cough Threshold's Sound Not Found")

    #todo：提高聚类精度
    clustering = AffinityPropagation(damping=0.75,max_iter=500).fit(np.array(amplitude_start_list).reshape(-1, 1))
    print(clustering.labels_)
    print(clustering.cluster_centers_)
    cough_start_points=[]
    cough_end_points=[]
    next_label=0
    for i in range(len(clustering.labels_)):
        if clustering.labels_[i]==next_label:
            cough_start_points.append(amplitude_start_list[i])
            next_label+=1
        if i<len(clustering.labels_)-1 and clustering.labels_[i+1]==next_label:
            cough_end_points.append(amplitude_start_list[i]+layback)
    cough_end_points.append(amplitude_end_process)

    print(cough_start_points)
    print(cough_end_points)

    output_segments=[]
    for i in range(len(cough_start_points)):
        stream = origin_stream[
                 int(cough_start_points[i] * len(origin_stream)):int(cough_end_points[i] * len(origin_stream))]
        output_segments.append(stream)

    return output_segments

def train_svm():
    all_neg_paths = glob.glob('./clinical/segmented/neg/*.mp3')
    all_pos_paths = glob.glob('./clinical/segmented/pos/*.mp3')

    all_neg_features = []
    for path in all_neg_paths:
        y, sr = librosa.load(path, sr=None)
        feature=get_mfcc_feature(y)
        print(len(feature))
        all_neg_features.append(feature)

    all_pos_features = []
    for path in all_pos_paths:
        y, sr = librosa.load(path, sr=None)
        feature = get_mfcc_feature(y)
        print(len(feature))
        all_pos_features.append(feature)

    fit_features = all_pos_features + all_neg_features
    fit_labels = [1] * len(all_pos_features) + [0] * len(all_neg_features)
    print(fit_labels)

    clf = svm.LinearSVC()
    clf.fit(fit_features, fit_labels)
    print(clf)
    joblib.dump(clf, 'cough_svm.pkl')

def predict(stream,clf):
    streams=list(map(lambda x:x[0:76795],cut_cough_segment(stream)))

    predict_outputs=[]
    for stream in streams:
        try:
            print(len(stream))
            predict_outputs.append(clf.predict([get_mfcc_feature(stream)])[0])
        except ValueError:
            continue

    if not len(predict_outputs):
        return -1
    return predict_outputs.count(1)/len(predict_outputs)