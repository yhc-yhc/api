
docker rm -f upload || echo upload not exists;
docker network create --subnet=172.18.0.0/16 pictureair;
docker run -itd \
--privileged=true \
--net pictureair --ip 172.18.0.19 \
-v /etc/localtime:/etc/localtime \
-v ~/logs:/root/logs \
-v /data:/data \
-v `pwd`:/src \
-p 8887:8888 \
-w /src \
--name upload \
node:8.9.4 \
/bin/bash -c "RUN=$1 npm start"
docker logs -f upload