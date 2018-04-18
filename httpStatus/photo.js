module.exports = {
    listPhotos: {
        method: 'GET',
        desc: "获取照片列表",
        headers: {
            token: [1, 'String', '用户认证id']
        },
        params: {
            siteId: [1, 'String', 'siteId'],
            code: [0, 'String', '共享不传，个人传。如果传了，shootDate必传'],
            shootDate: [0, 'String', '时间的字符串格式，YYYY/MM/DD。如果传了，code必传'],
            isPaid: [0, 'String', '-1: 全部, 0: 未购买, 1: 已购买, 默认-1'],
            limit: [0, 'Number', '显示条数,默认50'],
            lastId: [0, 'String', '上拉加载图片最后一个id，默认空'],
            useLimit: [0, 'boolean', '是否使用分页,默认true']
        },
        response: {
            "photos": [{
                "_id": "5aa89ec4581b9c004f0e934d",
                "siteId": "RSSG",
                "locationId": "al1",
                "shootOn": "2018-03-14T04:03:05.000Z",
                "isFree": false,
                "isPaid": true,
                "parkName": "River Safari",
                "mimeType": "jpg",
                "wMP4": {},
                "thumbnail": {
                    "x512": {
                        "width": 512,
                        "height": 17328,
                        "url": "media/2dc40ef353a7ee67734aef14fb42cb03f34e11ad60b4bba83147d235f551f491681525849d4994cb8c02d4976dd64c9fd192ad66b7d8d357761a9a1b6ad69c2e1478261d7c3e32fc474cd07dfafbfcb2"
                    },
                    "x1024": {
                        "width": 1024,
                        "height": 8664,
                        "url": "media/2dc40ef353a7ee67734aef14fb42cb036def052badd0126eeff675a0a57db182fa6af607c2ea9d98c2679e8b083ae1ca3dd5401d5ccadb1443a38793291fc655981db5b0130da9c933fcbda66fc2f796"
                    }
                },
                "originalInfo": {
                    "url": "media/2dc40ef353a7ee67734aef14fb42cb03d30d08c816109c4390b0cdb3bcc94ed7b2dd5989499bac4ba2ebb48568ac9adb31a6c4506a8411ee05715b1885f7b19d49cac68815b6b47600c990fcad2b0bf3",
                    "width": 3648,
                    "height": 2432,
                    "originalName": "al1_al1-6721-test-114404-43139993.JPG"
                }
            }]
        },
        resDesc: {

        }
    }
}