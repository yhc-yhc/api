
docker rm -f faceai || echo faceai not exists;
docker network create --subnet=172.18.0.0/16 pictureair;
docker run -itd \
--privileged=true \
--net pictureair --ip 172.18.0.18 \
-v ~/logs:/root/logs \
-v `pwd`:/src \
-p 12333:12333 \
-p 8888:8888 \
-w /src \
-e fly=product \
--name faceai \
node:8.9.4 \
/bin/bash -c "npm install && RUN=$1 npm start"
docker logs -f faceai