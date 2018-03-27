##start
	./fly.sh dev  加载config文件夹中dev.js
	./fly.sh build  加载config文件夹中build.js

### 批量修改文件名
	for i in `ls`; do mv -f $i `echo $i | sed 's/str1/str2/'`; done
	str1修改前， str2修改后
	使用例子：
	for i in `ls`; do mv -f $i `echo $i | sed 's/.data//'`; done

###mq容器与链接
	docker network create --subnet=172.18.0.0/16 pictureair;
	docker run -d --name rabbitmq --publish 5671:5671 \
	--publish 5672:5672 --publish 4369:4369 --publish 25672:25672 --publish 15671:15671 --publish 15672:15672 \
	--net pictureair --ip 172.18.0.20 \
	rabbitmq:management

	docker network create --subnet=172.18.0.0/16 pictureair;
	docker run -d --name rabbitmq1 \
	-p 5672:5672 -p 15672:15672 \
	--net pictureair --ip 172.18.0.20 \
	rabbitmq:management
	使用nodejs代码连接时：
	var amqp = require('amqp');
	var i = 0;
	var connection = amqp.createConnection({
	  host: '192.168.8.58',
	  port: 5672,
	  login: 'guest',
	  password: 'guest',
	  connectionTimeout: 10000,
	});
	curl serverIp:15672

### about docker logs
	docker logs -f -t --since="2017-05-31" --tail=10 edu_web_1
	--since : 此参数指定了输出日志开始日期，即只输出指定日期之后的日志。
	-f : 查看实时日志
	-t : 查看日志产生的日期
	-tail=10 : 查看最后的10条日志。
	edu_web_1 : 容器名称

	Delete the log file
	cat /dev/null >/var/lib/docker/containers/containerid/containerid.log-json.log
	/var/lib/docker/containers/containerid/containerid.log-json.log