module.exports = {

    listPhotos: {
        method: 'get',
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
            lteId: [0, 'String', '上拉加载图片最后一个id，默认空'],
            useLimit: [0, 'boolean', '是否使用分页,默认true']
        },
        response: {
            "photos": [{
                "_id": "59709dc01ee822140e00030e",
                "siteId": "SIHK",
                "photoId": "",
                "photoCode": "SIHKA20231320202212A",
                "name": "",
                "locationId": "ev1",
                "shootOn": "2017-07-20 20:10:28",
                "shootDate": "2017-07-20",
                "syncDate": "2017-07-20T12:15:55.620Z",
                "allowDownload": false,
                "isPaid": true,
                "coverHeaderImage": {
                    "lg": "/sites/SIHK/BG_V.jpg",
                    "xs": "/sites/SIHK/BG_H.jpg"
                },
                "logoUrl": "/new_sites/SIHK/logo.png",
                "pageUrl": "http://sky100.com.hk/",
                "parkName": "Sky100",
                "thumbnail": {
                    "x128": {
                        "url": "media/33267e46b01d333ada075909980910005b066ab8b7b7cf1744f2b212a0bcb1324b86aabba506d2e2e2f0f4424f945124860f727d5b8ffcb041e6b40f738dc58fb991b1b414e4bc15f65a85d5bdf4f4029f1d9e10d17f2efe263351066dc3761f",
                        "width": 240,
                        "height": 180
                    },
                    "x512": {
                        "url": "media/33267e46b01d333ada075909980910005b066ab8b7b7cf1744f2b212a0bcb132bcae1664877d2b63a48cab05d5bf2adacc87c9920b89d8d59d5e16a9b484cbcecbb56ad74d1c1f382dea61c903dc2f7f1103902f115f6ae5cfce045e702d84ef",
                        "width": 512,
                        "height": 384
                    },
                    "x1024": {
                        "url": "media/33267e46b01d333ada07590998091000c4635390d67d12da7a3d4035f9039298f6fc9a073ed406900047af75e3a159558c40f801455f1e820251714de64de3a48205883db8703081fc06ed30624bde7f",
                        "width": 1024,
                        "height": 768
                    }
                },
                "originalInfo": {
                    "url": "media/33267e46b01d333ada07590998091000f5c82f1943241cea7ceb384a540af410b5fec380620bcdb95c43fda7fa65a0d9b4d831b064d79abe03758913c182f96eb741ea812bcd30fe45a1872c0ea9fab7",
                    "height": 3450,
                    "width": 4600,
                    "originalName": "ev1_ev1-6EBE-00745446-200924-72615365_GS3.JPG"
                }
            }]
        },
        resDesc: {

        }
    }
}