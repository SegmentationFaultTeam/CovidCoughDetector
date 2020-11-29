# COVID咳嗽声检测

### 简介

本项目旨在通过机器学习，用咳嗽的录音判断使用者是否感染了新冠病毒，可以作为有效的新冠病毒初步检测的机制，提高新冠病毒检测的效率。在检测的准确度方面，有MIT和剑桥的论文作为理论支撑，理论上最高准确率可达98%，完全满足作为初步检测的条件。

### 架构

机器学习的后端，训练完成后加载到云服务器上，开放一个传入接口，传入一张照片和一段音频，开放一个传出接口，返回一段文字，包含用户的名字和是否感染

前端从摄像头获取用户咳嗽时的照片，同时录取咳嗽的音频，传送给后端；接受从后端返回的用户名和是否感染，显示在屏幕上

### 后端

后端部署：
在cough-checker-api根目录下使用gunicorn启动项目
gunicorn -w 4 -b 内网IP:端口号 main:app &

将nginx.conf和nginxssl.conf放入/etc/nginx文件夹下（只是建议，可以放在其他位置）后：
nginx -c /etc/nginx/nginx.conf 或 nginx -c /etc/nginx/nginxssl.conf
启动nginx后即可通过域名或外网IP访问接口

运行环境：Ubuntu 16.04 Server

项目依赖：
ubuntu：Python3、ffmpeg、nginx
Python 3：gunicorn、flask、numpy、cv2、dlib、face_recognition、sklearn、matplotlib、pymysql、redis、librosa、flask_cors

### 前端

使用微信小程序开发html、js、css结合



[小程序实例](https://github.com/SegmentationFaultTeam/CovidCoughDetector/tree/master/docs/1.png)



https://github.com/SegmentationFaultTeam/CovidCoughDetector/tree/master/docs/2.png

https://github.com/SegmentationFaultTeam/CovidCoughDetector/tree/master/docs/3.png