from builtins import *

import cv2
import face_recognition
import os
import numpy as np


class FaceInfo:
    def __init__(self, img, t_id, name):
        self.img = img
        self.t_id = t_id
        self.name = name


faceInfoDict = dict()

def img_pretreat(img):
    face_locations = face_recognition.face_locations(img)
    # To find out the hugest face in the list. Use (r-l)*(b-t) and t, r, b, l = face_location
    face = sorted(face_locations, key=lambda face: (face[2] - face[0]) * (face[1] - face[3]))[-1]
    img_q = cv2.resize(img[face[0]:face[2], face[3]:face[1]], (200, 200), interpolation=cv2.INTER_CUBIC)
    return img_q


def cv_imread(filePath):
    """
    to replace the cv2.imread to read the unicode paths
    :type filePath: string
    """
    cv_img = cv2.imdecode(np.fromfile(filePath, dtype=np.uint8), -1)
    # for some old version, RGB should be transformed to BGR
    # cv_img = cv2.cvtColor(cv_img, cv2.COLOR_RGB2BGR)
    return cv_img


def query(img: object) -> (str, str):
    """
    find out who is in the img
    img should have been preprocessed, and must be 200*200
    :rtype: (t_id: str, name: str)  if something wrong, id will be "" and name will be the reason
    :param img: cv2's img (i don't know whats that)
    """
    img=img_pretreat(img)
    try:
        if (len(img) != 200 or len(img[0]) != 200):
            # wrong size
            raise IOError("Size Error")
        print(faceInfoDict)
        for faceInfo in faceInfoDict.values():
            # i haven't make me understand it, maybe the algorithm is based on gray pics instead of colorful ones
            results = face_recognition.compare_faces(
                faceInfo.img,
                img
            )[0][0]
            if results:
                return faceInfo.t_id, faceInfo.name
    except:
        raise ValueError("Identity Not Found")


def register(img, t_id: str, name: str = '') -> int:
    """
    register the person in the img
    registered img should have been preprocessed
    :rtype: 0   success
            -1  unknown fault
            1   exist
    :param img: cv2's img (i don't know whats that)
    :param t_id: str
    :param name: str
    """
    img=img_pretreat(img)
    try:
        if t_id in faceInfoDict:
            return 1
        faceInfoDict[t_id] = FaceInfo(t_id, name, img)
        return 0
    except:
        return -1


def init():
    pwd = os.getcwd() + "/figures/"
    files = os.listdir(pwd)
    serial_id = 0
    for filename in files:
        serial_id += 1
        img = cv_imread(pwd + filename)
        face_locations = face_recognition.face_locations(img)
        # To find out the hugest face in the list. Use (r-l)*(b-t) and t, r, b, l = face_location
        face = sorted(face_locations, key=lambda face: (face[2] - face[0]) * (face[1] - face[3]))[-1]
        # get the real face and resize to 200 * 200
        img_q = cv2.resize(img[face[0]:face[2], face[3]:face[1]], (200, 200), interpolation=cv2.INTER_CUBIC)
        faceInfoDict[serial_id] = FaceInfo(img_q, serial_id, os.path.splitext(filename)[0])


init()
