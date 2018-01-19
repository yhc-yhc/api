/**
 * Created by Vicky on 11/15/15.
 */

module.export =
{
    siteId: {type: String, required: true},//乐园标示
    siteName: {type: String},
    productId: {type: String, required: true},//默认商品id
    productName: {type: String},//默认商品名称
    siteCode: {type: String},
    siteUrl: {type: String},
    siteTheme: {type: String},//默认VT样式
    version: {type: String},
    photoNum: {type: Number, default: 20},//显示照片张数
    modePhotoNum: {type: Number, default: 20},
    colNum: {type: Number, default: 4},
    photoSize: {//照片显示的尺寸
        width: {type: Number},
        height: {type: Number}
    },
    DisplaysScanPage: {type: Boolean, default: true},//是否显示扫描页
    disabled: {type: Boolean},//是否启用
    createdOn: Date,//创建时间
    modifiedOn: Date,//修改时间
    createdBy: String,//创建者ID
    modifiedBy: String //创建者ID
}