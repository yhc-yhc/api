/**
 * Created by vicky on 17/4/17.
 */
module.exports = {
    parkId: {type: String, required: true},//主题乐园id
    outletId: {type: String, required: true},//门店id
    displayInfo: [{
        screenCode: {type: String, required: true, unique: true},//显示器代码
        seq: {type: Number, required: true},//显示器编号（顺序）
        screenType: {type: String, required: true},//live photos or preset photos 动态显示照片或者只显示固定的图片
        screenCount: {type: Number, required: true},//同一页面显示图片的个数
        screenTextFormat: {type: String},//显示文本及替换信息，例：“迪士尼旋转木马 %now% %shootOn% %ticketid% %screenCode% %photoId%”
        screenTextLocation: {
            x: Number,
            y: Number
        },//文本在照片中的位置
        layout: [
            {
                seq: String,//多张照片的显示顺序
                capacity: Number,//how many use grid in page. 三张照片时，本张照片占一个格子或者两个格子
                location: String //leftUp leftDown rightUp rightDown
            }
        ],
        presetUrl: [{//预设图片信息
            seq: {type: String},//图片的序号
            url: {type: String}//图片的地址
        }],
        prefix: {type: String}//查询条件：照片前缀
    }],
    disabled: {type: Boolean, default: true}, //图片是否有效 审核后改为false
    fontFace: {type: String},//字体
    fontColor: {type: String},//字体颜色
    fontSize: {type: String},//字体大小
    delayTime: {type: Number, default: 300},//照片拍摄完成后，延迟多久再显示 单位 秒
    showTime: {type: Number, default: 600},//一轮照片的显示总时间  单位 秒
    refreshInterval: {type: Number, default: 3},//刷新间隔 单位 秒
    transition: {type: String},//过渡动画，切换效果
    margin: {//整体照片在page里面显示的位置信息
        top: {type: Number},
        left: {type: Number},
        bottom: {type: Number},
        right: {type: Number}
    },
    createdOn: {type: Date, required: true},
    createdBy: {type: String, required: true},
    modifiedOn: {type: Date, required: true},
    modifiedBy: {type: String, required: true}
}