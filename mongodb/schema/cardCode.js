module.exports = {
    siteIds: { type: [String] },
    PPPCode: {type: String, index: true},  //pp+卡号
    SN: {type: String, index: true},//对应的序列号
    PPPType: String,//photoPassPlus的类型
    oType: String,//大类：photoPassPlus，photoPass，coupon，eventPass
    capacity: {type: Number}, //容量，可绑定数量
    days: {type: Number}, //天数，可绑定的天数

    ownerId: {type: String},//购买者Id
    userId: {type: String, index: true},//使用者Id
    bindOn: {type: Date}, //绑定PP时间,激活时间,coupon的使用时间，
    expiredDay: {type: Number, default: 3},//有效期，激活后多久失效
    expiredOn: {type: Date},//失效时间，激活时间+有效期
    effectiveOn: {type: Date},//生效时间
    ownOn: {type: Date},//绑定到用户的时间
    soldOn: {type: Date},//卖出时间

    photoCount: {type: Number},//可升级的photo数，不限制数量为-1
    locationIds: {type: [String]},//可以使用的地点。

    productIds: [String],//可以适用的商品

    active: Boolean,//是否可用
    isSold: {type: Boolean, default: false},//是否已卖出
    isVirtual: {type: Boolean, default: true},//是否是虚拟卡
    parentId: String,//
    createdOn: Date,//创建时间
    modifiedOn: Date,//修改时间
    createdBy: String,//创建者ID
    modifiedBy: String, //创建者ID
    markDesc: {
        askUser: {type: String, index: true},
        useDept: {type: String, index: true}
    }, //标记,
    soldInfo: {
        receiptNumber: {type: String, index: true},
        employeeId: {type: String, index: true},
        outletId: {type: String, index: true}
    }
}