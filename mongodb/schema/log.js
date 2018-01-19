/**
 * Created by Steve on 7/27/15.
 */

module.exports = {
    userId: {type: String, index: true},    //操作者用户Id
    userType: {type: String},    //用户类型
    action: {type: String, index: true},    //操作类型：新增，删除，修改等
    objectId: {type: String, index: true},    //被操作的对象Id
    objectType: {type: String},    //被操作对象的类型：用户，相册，照片等
    sourceTable: String,    //被操作表
    location: {type: String},    //地点
    terminal: {type: String},    //终端：手机app，网站
    tokenId: {type: String},    //操作者的tokenId
    userIP: {type: String},    //操作者的IP
    remark: {type: String},    //备注
    createdOn: Date,//创建时间
    modifiedOn: Date,//修改时间
    createdBy: String,//创建者ID
    modifiedBy: String //创建者ID
}