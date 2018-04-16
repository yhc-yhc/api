module.exports = {
    // 图片总数pictureCount  pp卡总数pictureCount 优惠券总数coupons
    userName: { type: String, index: true, required: true, unique: true }, // 用户名
    mobile: { type: String, index: true, default: '', unique: true }, //电话号码
    email: { type: String, index: true, default: '', unique: true }, //Email
    emailVerified: { type: Boolean, default: false }, //Email 是否已经验证通过
    password: { type: String }, //密码
    registerTerminal: { type: String, index: true }, //注册终端// ios，android,web
    registerOn: { type: Date, required: true, default: Date.now() }, //注册日期
    lgsyscode: { type: String, index: true }, //操作系统语言码
    lgcode: { type: String, index: true }, //用户使用的语言码
    //uuid:{type: String, index: true},//用户手机的UUID
    //用户信息
    name: { type: String, default: '' }, //姓名
    gender: { type: Number, default: -1 }, //性别 -1 未知 0 女 1 男
    country: { type: String, default: '' }, //国家
    qq: { type: String }, //国家
    birthday: { type: Date }, //出生日期
    avatarUrl: { type: String, default: '' }, //用户头像
    coverHeaderImage: { type: String }, //用户主页头部图片
    allowFollowed: { type: Boolean, default: true }, //是否允许他人关注
    userPP: { type: String, index: true }, //注册后根据用户生成的PP号
    roleIds: [], //角色类型
    userType: { type: String, default: 'user' }, //用户类型，user,guide
    guideYear: { type: Number, default: 0 }, //带团年数
    IDCard: String, //身份证
    travelAgency: String, //旅行社
    guideCard: String, //导游证
    alipayAccount: String, //支付宝账户
    accountBalance: { type: Number, default: 0 }, //账户余额
    totalProfit: { type: Number, default: 0 }, //累计盈利
    lastLoginOn: { type: Date, default: Date.now() }, //上次登陆时间
    lastLogoutOn: { type: Date, default: Date.now() }, //上次退出时间
    lastLogoutUrl: { type: String }, //上次登出界面
    disabled: { type: Boolean, required: true, default: false }, //是否无效
    disablereason: { type: String, default: "" }, //禁用原因
    allowedPermissions: [], //RoleId包含的权限以外的权限
    denyPermissions: [], //禁止的权限
    addresses: [{
        area: { type: String }, //国家（区域）
        provinces: { type: String }, //省份
        city: { type: String }, //城市
        county: { type: String }, //区县
        detailedAddress: { type: String }, //详细地址
        zip: { type: String }, //邮编
        consignee: { type: String }, //收货人姓名
        mobileNum: { type: String }, //手机号码
        telephone: { type: String }, //电话号码
        defaultChose: { type: Boolean } //默认是否选中（单选）
    }],
    pppCodes: {
        type: [
            mongoose.Schema({
                siteIds: { type: [String] },
                locationIds: { type: [String] }, //可以使用的地点。
                productIds: [String], //可以适用的商品
                PPPCode: { type: String, index: true, unique: true }, //pp+卡号
                PPCode: { type: String }, //pp卡号
                PPPType: String, //OneDayPass photoPassPlus的类型
                oType: String, //大类：Gift photoPassPlus，photoPass，coupon，eventPass
                days: { type: Number }, //天数，可绑定的天数
                bindOn: { type: Date, default: Date.now() },
                expiredDay: { type: Number, default: 3 }, //有效期，激活后多久失效
                expiredOn: { type: Date }, //失效时间，激活时间+有效期
                effectiveOn: { type: Date }, //激活时间
                soldOn: { type: Date }, //卖出时间
                active: { type: Boolean, default: false }, //是否激活
                photoCount: { type: Number, default: -1 }, //可升级的photo数，不限制数量为-1
            }, { _id: false })
        ]
    },
    customerIds: {
        type: [
            mongoose.Schema({
                code: { type: String, index: true }, //pp
                bindOn: { type: Date, default: Date.now() }
            }, { _id: false })
        ]
    },
    coupons: {
        type: [
            mongoose.Schema({
                code: { type: String }, //code
                type: { type: String }, // 标示类型
                bindOn: { type: Date, default: Date.now() },
                expiredOn: { type: Date },
                use: { type: Boolean, default: false }, //是否使用
                des: { type: String },
                siteIds: { type: [String] },
                limit: {
                    minimumAmount: { type: Number }
                },
                amount: { type: Number, required: true } //优惠券金额
            }, { _id: false })
        ]
    },
    albums: [{
        name: { type: String }, //相册名称
        description: { type: String }, //描述
        isFree: Boolean, //是否免费
        coverImageUrl: { type: String }, //相册背景图
        shareInfo: [{
            channel: String, //分享渠道
            count: Number //分享次数
        }],
        visitedCount: { type: Number, default: 0 }, // 访问次数
        likeCount: { type: Number, default: 0 }, //点赞次数
        comments: [{ //评论信息
            comment: String, //评论内容
            userId: String, //评论者Id可以为空
            userIP: String, //用户IP
            lastEditTime: Date //评论时间
        }],
        followedUsers: { type: [String], index: true }, //关注本相册的用户
        tagBy: [String], //相册中照片包含的人员名称
        locationId: { type: String, index: true }, //拍摄点Id
        urlId: { type: String }, //对外访问的链接Id
        createdOn: Date, //创建时间
        modifiedOn: Date //修改时间
    }],
    likePhotos: [String], //点赞的photoIds

    favoriteAlbums: {
        type: [ //收藏的相册Ids
            { type: String }
        ]
    },
    favoriteProducts: {
        type: [ //收藏的产品Ids
            { type: String }
        ]
    },

    favoritePhotos: {
        type: [ //收藏的照片Ids
            { type: String }
        ]
    },

    followingUsers: {
        type: [ //关注的用户Ids
            { type: String }
        ]
    },
    followingPhotos: {
        type: [ //关注的照片Ids
            { type: String }
        ]
    },
    followingAlbums: {
        type: [ //关注的相册Ids
            { type: String }
        ]
    },
    followingParks: {
        type: [ //关注的公园Ids
            { type: String }
        ]
    },
    followingExploreCards: {
        type: [ //关注的发布卡Ids
            { type: String }
        ]
    },
    followedUsers: {
        type: [ //关注自己的用户Ids
            { type: String }
        ]
    },
    sharedUsers: {
        type: [ //分享自己的用户Ids
            { type: String }
        ]
    },
    likedUsers: {
        type: [ //喜欢自己的用户Ids
            { type: String }
        ]
    },
    visitedUsers: {
        type: [ //访问过自己的用户Ids
            { type: String }
        ]
    },
    cart: { //购物车
        items: [{
            goodsKey: { type: String },
            qty: { type: Number },
            price: { type: Number },
            embedPhotos: [{
                photoId: { type: String },
                ppCodes: [
                    { type: String }
                ],
                photoIp: { type: String }
            }]
        }],
        preferentialPrice: { type: Number, default: 0 }, //节省了多少钱
        totalPrice: { type: Number, default: 0 },
        totalCount: { type: Number, default: 0 } //购物车内商品总数量
    },
    openIds: { //第三方登陆的openId
        QQ: { type: String }, //
        facebook: { type: String }, //
        instagram: { type: String } //

    },
    favoriteLocationIds: {
        type: [ //收藏的地点信息
            { type: String }
        ],
        index: true
    },
    hiddenPPList: {
        type: [
            mongoose.Schema({
                code: { type: String, index: true }
                //                , //pp或ep的code
                //                shootDate: String // 拍摄日期
            }, { _id: false })
        ]
    }, //需要隐藏的PP列表

    permission: { type: [], default: [] }, //用户权限 (ctrip:携程)
    ticketId: String, //门票号
    userGroup: String, //用户类型:walkIn,group,event,online
    systemMessagePush: { type: Boolean, required: true, default: true }, //是否接收系统消息,默认是接收  steve
    createdOn: { type: Date, default: Date.now() }, //创建时间
    modifiedOn: { type: Date, default: Date.now() } //修改时间
    //});
}