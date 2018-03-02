/**
 * Created by tianlisa on 14-8-21.
 */
const mongoose = require('mongoose')
module.exports = {
    siteId: {type: String}, //  index: true},
    photoId: {type: String, index: true},
    photoCode: {type: String, index: true},
    shootOn: {type: Date, index: true},
    extractOn: {type: Date, index: true},
    presetName: {type: String}, // index: true},
    presetId: {type: String}, // index: true},

    //pp或ep的信息
    customerIds: [
        mongoose.Schema(
            {
                //code: String,  //pp或ep的code
                code: {type: String, index: true},  //pp或ep的code
                cType: String, //标示类型为pp还是ep
                userIds: {type: [String], index: true, default: []} //用户Id列表
            }, {_id: false})
    ],
    words: [],
    ocrNum: {type: Number, default: 0},
    photoCode: {type: String, index: true},   //照片code
    userIds: {type: [String], index: true}, //照片所属的用户Ids
    userId: {type: String, index: true}, // same as tokenBy
    name: {type: String}, //照片名称
    shootOn: {type: Date, index: true},  //拍摄时间
    extractOn: {type: Date, index: true},    //提取时间
    description: {type: String},  //描述
    downloadCount: {type: Number, default: 0},  //下载次数
    visitedCount: {type: Number, default: 0},   //访问次数
    shareInfo: [
        {
            sourceId: String,
            sourceSecret: String,

            channel: String, //分享渠道
            count: Number   //分享次数
        }
    ],
    editCount: {type: Number, default: 0},  //编辑次数
    likeCount: {type: Number, default: 0},  //点赞次数

    orderHistory: [{
        customerId: {type: String, index: true},
        productId: String,
        prepaidId: {type: String, index: true},
        userId: {type: String, index: true},
        createdOn: {type: Date}
    }],

    comments: [
        { //评论信息
            comment: String, //评论内容
            userId: String, //评论者Id可以为空
            userIP: String, //用户IP
            lastEditTime: Date //评论时间
        }
    ],
    albumId: {type: String, index: true}, //相册Id
    tagBy: [String], //相片包含的人员
    originalInfo: { //原图信息
        originalName: {type: String, index: true}, //原图名称
        path: String, //物理路径
        width: Number, //宽
        height: Number, //高
        url: String //url
    },
    originalPath: {type: String, index: true},
    thumbnailType: [], //缩略图类型
    thumbnail: {}, //缩略图信息{x1024:{path:路径, width:宽, height:高， url:url},x512:{},x128:{}}
    GPS: { //GPS信息
        ImageUniqueID: String,
        GPSInfo: String,
        GPSLatitudeRef: String,
        GPSLatitude: String,
        GPSLongitudeRef: String,
        GPSLongitude: String,
        GPSAltitudeRef: String,
        GPSAltitude: String,
        GPSTimeStamp: String,
        GPSDateStamp: String
    },
    locationId: {type: String, index: true}, //拍摄点Id
    parentId: {type: String, index: true}, //原始图片Id
    disabled: {type: Boolean, default: false}, //图片是否有效
    rawFileName: {type: String, index: true}, //相机内照片原始名称
    originalFileName: {type: String, index: true},
    isFree: {type: Boolean, default: false}, //是否免费
    isVip: Boolean, //是否VIP
    targetPoint: String, // 拍摄照片后送达的地点信息
    allowDownload: {type: Boolean, default: true},//是否允许下载
    //engine信息
    engineInfo: {
        chroma: {type: Boolean, default: false, index: true},//是否需要绿背景扣图
        width: {type: Number, required: true}, //宽
        height: {type: Number, required: true}, //高
        Orientation: {type: String, default: '-1'},
        rawPath: {type: String, required: true, index: true},
        rawUrl: {type: String, required: true, index: true},
        imageJson: {type: String, required: true},
        imageJsonUrl: {type: String, required: true},
        originalPath: {type: String, required: true},
        originalFileSize: {type: Number, default: 1},
        originalUrl: {type: String, required: true},
        ticketNum: {type: String},
        ticketPrefix: {type: String},
        deleted: {type: Boolean, default: false},
        rawthumbnail: {},//raw 文件夹
        originalthumbnail: {}// original backup 文件夹
    },//照片引擎信息
    tokenBy: {type: String, index: true}, //摄影师
    photoStatus: {type: String, index: true, default: "init"},//照片状态 init checked unchecked edit bad 
    siteId: String,//服务器ID
    photoSource: {type: String, index: true, default: 'engine'},//照片来源
    createdOn: Date,//创建时间
    receivedOn: Date,//创建时间
    modifiedOn: Date,//修改时间
    createdBy: String,//创建者ID
    modifiedBy: String, //创建者ID
    checkedUser: {type: String, index: true},//审核人
    checkedTime: {type: Date, index: true},//审核时间
    scoreInfo: {//buz的分数信息
        fileName: String,
        dateTime: String,
        vehicleID: String,
        vehicleOperation: String,
        leftScore: Number,
        rightScore: Number,
        leftGunColor: Number,
        rightGunColor: Number,
        leftGunRanking: Number,
        rightGunRanking: Number,
        leftGunMasterBlaster: Number,
        leftGunSharpShooter: Number,
        rightGunMasterBlaster: Number,
        rightGunSharpShooter: Number
    },
    scoreStatus: {type: Boolean, default: false}, //分数是否已经合成
    presetId: {type: String, index: true},//模版ID
    presetName: {type: String},//模版ID
    mimeType: {type: String, index: true},//jpg/mp4
    editHistorys: [
        {
            originalInfo: {
                originalName: {type: String},
                path: {type: String},
                width: {type: Number},
                height: {type: Number},
                url: {type: String}
            },
            thumbnail: {}
        }
    ],//edit  originalInfo,thumbnail
    encounter: {type: String, index: true},//拍摄组
    pacId: {type: String, index: true},//pac ID
    hasSynced: {type: Boolean, default: false, index: true}, //是否已经同步
    storageServerIP: {type: String},//照片服务器的ip+端口
    appServerIP: {type: String},//api服务器的ip+端口
    mobileEditActive: {type: Boolean, default: true, index: true}, //已经加模板手机端不能编辑
    favoriteCode: [
        mongoose.Schema(
            {
                code: String,  //pp或ep的code
                cType: String, //标示类型为pp还是ep
            }, {_id: false})
    ]//收藏的pp码
    ,
    videoStatus: {type: String, default: 'init', index: true},//init generating generated uploading uploaded   合成中 已完成  上传中(in redis)  已上传
    photo_id: {type: String},//照片转成视频前的_id
    adInfo: {
        originalName: {type: String, index: true}, //原图名称
        path: {type: String}, //物理路径
        width: {type: Number}, //宽
        height: {type: Number}, //高
        url: {type: String} //url
    },
    videoPresetName: [{type: String}],
    isUpload: {type: Boolean, default: false},
    uploadCount: {type: Number, default: 0},
    disabled: {type: Boolean, default: false},
    faces: {type: [String], index: true},
    bundleWithPPP: {type: Boolean, default: false} //如果为true,不能单独购买,只能买了pp+之后才能拥有
}

