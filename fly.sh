
docker rm -f faceai || echo faceai not exists;
docker network create --subnet=172.18.0.0/16 pictureair;
docker run -itd \
--privileged=true \
--net pictureair --ip 172.18.0.18 \
-v /etc/localtime:/etc/localtime \
-v ~/logs:/root/logs \
-v /data:/data \
-v `pwd`:/src \
-p 7777:7777 \
-p 8888:8888 \
-w /src \
-e fly=product \
--name faceai \
node:8.9.4 \
/bin/bash -c "RUN=$1 npm start"
docker logs -f faceai