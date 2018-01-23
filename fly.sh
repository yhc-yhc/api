
docker rm -f api || echo api not exists;
docker network create --subnet=172.18.0.0/16 pictureair;
docker run -itd \
--privileged=true \
--net pictureair --ip 172.18.0.18 \
-v `pwd`:/src \
-w /src \
-p 3001:3000 \
-e fly=product \
--name api \
node:8.9.4 \
/bin/bash -c "$* npm start"
docker logs -f api