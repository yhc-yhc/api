/**
 * Created by tianlisa on 14-10-15.
 */


module.exports = {
    PPPCode: {type: String, index: true},  //pp+卡号
    SN:{type:String,index:true},//对应的序列号
    PPPType:String,//photoPassPlus的类型
    oType:String,//大类：photoPassPlus，photoPass，coupon，eventPass
    capacity: {type: Number}, //容量，可绑定数量
    days:{type:Number}, //天数，可绑定的天数
    bindDates:{type: [String], index: true}, //已绑定的日期组
    PPList:{type: [String], index: true},    //已绑定的PP组
    photoList:[String],//已经升级的照片组，主要针对体验卡
    orderId:String,//coupon应用的order
    bindInfo:[{
        customerId:{type: String, index: true},//PP号码
        cType:String,//PP类型
        photoId:String,//photo的_id;//pp+体验卡升级的photoId
        userIds:{type: [String], index: true},//PP所属的用户
        bindDate:String,    //PP绑定的日期yyyy-MM-dd
        bindOn:Date,//绑定时间
        bindBy:String   //绑定人
    }],//已绑定的PP组
    ownerId: {type: String},//购买者Id
    userId: {type: String, index: true},//使用者Id
    bindOn: {type: Date}, //绑定PP时间,激活时间,coupon的使用时间，
    expiredDay:{type:Number,default:3},//有效期，激活后多久失效
    expiredOn:{type:Date},//失效时间，激活时间+有效期
    effectiveOn:{type:Date},//生效时间
    allowDates:[String],//限定的可以升级的日期。
    ownOn:{type:Date},//绑定到用户的时间
    soldOn: {type: Date},//卖出时间

    photoCount:{type:Number},//可升级的photo数，不限制数量为-1
    locationIds:{type:[String]},//可以使用的地点。

    productIds:[String],//可以适用的商品

//    //升级信息
//    upgradeInfo: [
//        {
//            uType: String,//升级类型：天数，个数
//            capacity: Number, //升级
//            upgradeOn: Date,//升级时间
//            upgradeBy: String  //操作人
//        }
//    ],
    active: Boolean,//是否可用
    isSold: {type:Boolean,default:false},//是否已卖出
    isVirtual:{type:Boolean,default:true},//是否是虚拟卡
    parentId:String,//
    createdOn: Date,//创建时间
    modifiedOn: Date,//修改时间
    createdBy: String,//创建者ID
    modifiedBy: String //创建者ID
}