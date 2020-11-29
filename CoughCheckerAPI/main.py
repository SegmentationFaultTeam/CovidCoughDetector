from config import IP_HOST,IP_PORT
from base import app
from views import *


if __name__=='__main__':
    app.run(host=IP_HOST,port=IP_PORT,debug=True)