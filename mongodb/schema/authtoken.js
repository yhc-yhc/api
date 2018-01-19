/**
 * Created by tianlisa on 15-12-15.
 */

module.exports = {
    appKey: String,//appKey
    appSecret: String,//appSecret
    appID: String,//appkey和appSecret相加链接加密后的字符串
    createdOn: {type: Date, default: Date.now},//创建时间
    createdBy: {type: String},//创建人，userId
    modifiedOn: {type: Date, default: Date.now},//修改时间
    modifiedBy: {type: String}//修改人
}