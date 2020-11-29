import hashlib
import random
import datetime
from builtins import *



def commonResponse(statusCode=200, responseStr='Request Success', responseHeaders={}):
    return responseStr, statusCode, responseHeaders


def generate_random_hash():
    text=''.join(random.sample
                 (['z','y','x','w','v','u','t','s','r','q','p','o','n','m','l','k','j','i','h','g','f','e','d','c','b','a']
                  , 15))+str(datetime.datetime.now())
    return hashlib.sha256(text.encode("utf-8")).hexdigest()
