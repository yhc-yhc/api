/**
 * Created by Steve on 14/8/7.
 */
const mongoose = require('mongoose');
module.exports = {
    userId: {type: String, unique: true, index: true, required: true},
    userName: {type: String, required: true},
    password: {type: String},
    userGroup: {type: String},
    loginDatetime: {type: Date},
    lineStatus: {type: String},
    workArea: {type: String},//默认地点
    outletId: {type: String},
    outletName: {type: String},
    authCode: {type: String},
    remark: {type: String},
    parkId: {
        type: mongoose.Schema.ObjectId,
        ref: 'park'
    },
    customerPhotoPass: {type: String},
    customerOnlineUserId: {type: mongoose.Schema.ObjectId},
    locationId: {type: String},
    locationName: {type: String},
    cameraPrefixes: {type: String},
    disabled: {type: Boolean},
    creDatetime: {type: Date, required: true},
    creUser: {type: String, required: true},
    updDatetime: {type: Date, required: true},
    updUser: {type: String, required: true},//下面是onlinesuer

    email: {type: String, index: true}, //Email
    userPP: {type: String, index: true},    //注册后根据用户生成的PP号
    roleIds: [], //角色类型
    userType: {type: String, default: 'user'}, //用户类型，user,guide
    guideYear: {type: Number, default: 0},//带团年数
    IDCard: String,//身份证
    travelAgency: String,//旅行社
    guideCard: String,//导游证
    alipayAccount: String,//支付宝账户
    registerTerminal: String,
    accountBalance: {
        type: Number,
        default: 0
    }, //账户余额
    totalProfit: {
        type: Number,
        default: 0
    }, //累计盈利

    name: {
        type: String
    }, //姓名
    gender: {
        type: String
    }, //性别
    password: {
        type: String
    }, //密码
    country: {
        type: String
    }, //国家
    qq: String, //qq
    birthday: {
        type: Date
    }, //出生日期
    mobile: {
        type: String
    }, //电话号码
    qq: String, //qq号码
    registerOn: {
        type: Date,
        required: true,
        default: Date.now
    }, //注册日期
    lastLoginOn: Date, //上次登陆时间
    lastLogoutOn: Date, //上次退出时间
    lastLogoutUrl: {
        type: String
    }, //上次登出界面
    disabled: {
        type: Boolean,
        required: true,
        default: false
    }, //是否无效
    allowedPermissions: [], //RoleId包含的权限以外的权限
    denyPermissions: [], //禁止的权限
    customerIds: {
        type: [{
            code: {
                type: String,
                index: true
            }, //pp或ep的code
            cType: String, // 标示类型为pp还是ep
            bindOn: {
                type: Date,
                default: Date.now
            }
        }]
    },
    albums: [{
        name: {
            type: String
        }, //相册名称
        description: {
            type: String
        }, //描述
        isFree: Boolean, //是否免费
        coverImageUrl: {
            type: String
        }, //相册背景图
        shareInfo: [{
            channel: String, //分享渠道
            count: Number   //分享次数
        }
        ],
        visitedCount: {type: Number, default: 0}, // 访问次数
        likeCount: {type: Number, default: 0}, //点赞次数
        comments: [
            { //评论信息
                comment: String, //评论内容
                userId: String, //评论者Id可以为空
                userIP: String, //用户IP
                lastEditTime: Date //评论时间
            }
        ],
        followedUsers: {type: [String], index: true}, //关注本相册的用户
        tagBy: [String], //相册中照片包含的人员名称
        locationId: {type: String, index: true}, //拍摄点Id
        urlId: {type: String}, //对外访问的链接Id
        createdOn: Date, //创建时间
        modifiedOn: Date //修改时间
    }
    ],
    likePhotos: [String],//点赞的photoIds

    favoriteAlbums: {
        type: [ //收藏的相册Ids
            {type: String}
        ]
    },
    favoriteProducts: {
        type: [ //收藏的产品Ids
            {type: String}
        ]
    },

    favoritePhotos: {
        type: [ //收藏的照片Ids
            {type: String}
        ]
    },

    followingUsers: {
        type: [ //关注的用户Ids
            {type: String}
        ]
    },
    followingPhotos: {
        type: [ //关注的照片Ids
            {type: String}
        ]
    },
    followingAlbums: {
        type: [ //关注的相册Ids
            {type: String}
        ]
    },
    followingParks: {
        type: [ //关注的公园Ids
            {type: String}
        ]
    },
    followingExploreCards: {
        type: [ //关注的发布卡Ids
            {type: String}
        ]
    },
    followedUsers: {
        type: [ //关注自己的用户Ids
            {type: String}
        ]
    },
    sharedUsers: {
        type: [ //分享自己的用户Ids
            {type: String}
        ]
    },
    likedUsers: {
        type: [ //喜欢自己的用户Ids
            {type: String}
        ]
    },
    visitedUsers: {
        type: [ //访问过自己的用户Ids
            {type: String}
        ]
    },
    avatarUrl: {
        type: String
    }, //用户头像
    coverHeaderImage: {
        type: String
    }, //用户主页头部图片

    allowFollowed: {
        type: Boolean,
        default: true
    }, //是否允许他人关注
    cart: { //购物车
        items: [{
            goodsKey: {
                type: String
            },
            qty: {
                type: Number
            },
            price: {
                type: Number
            },
            embedPhotos: [{
                photoId: {
                    type: String
                },
                ppCodes: [{
                    type: String
                }],
                photoIp: {
                    type: String
                }
            }]
        }],
        preferentialPrice: {
            type: Number,
            default: 0
        }, //节省了多少钱
        totalPrice: {
            type: Number,
            default: 0
        },
        totalCount: {
            type: Number,
            default: 0
        } //购物车内商品总数量
    },
    openIds: {  //第三方登陆的openId
        QQ: {type: String}, //
        facebook: {type: String}, //
        instagram: {type: String} //

    },
    favoriteLocationIds: {
        type: [ //收藏的地点信息
            {
                area: {type: String},		    //国家（区域）
                provinces: {type: String},		//省份
                city: {type: String},		    //城市
                county: {type: String},		    //区县
                detailedAddress: {type: String},//详细地址
                zip: {type: String},		    //邮编
                consignee: {type: String},		//收货人姓名
                mobileNum: {type: String},		//手机号码
                telephone: {type: String},		//电话号码
                defaultChose: {type: Boolean}	//默认是否选中（单选）
            }
        ],
        index: true
    },
    addresses: [{
        area: {
            type: String
        }, //国家（区域）
        provinces: {
            type: String
        }, //省份
        city: {
            type: String
        }, //城市
        county: {
            type: String
        }, //区县
        detailedAddress: {
            type: String
        }, //详细地址
        zip: {
            type: String
        }, //邮编
        consignee: {
            type: String
        }, //收货人姓名
        mobileNum: {
            type: String
        }, //手机号码
        telephone: {
            type: String
        }, //电话号码
        defaultChose: {
            type: Boolean
        } //默认是否选中（单选）
    }],
    hiddenPPList: {
        type: [{
            code: {
                type: String,
                index: true
            }
//                , //pp或ep的code
//                shootDate: String // 拍摄日期
        }, {_id: false}]
},//需要隐藏的PP列表
ticketId: String, //门票号
    userGroup: String, //用户类型:walkIn,group,event,online
    allowCollect: {type: Boolean, default: false},//用户信息是否允许被收集,add by lisa 2017.2.20
createdOn: Date, //创建时间
    modifiedOn: Date //修改时间
//});
}






