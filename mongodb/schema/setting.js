/**
 * Created by Steve on 4/15/15.
 */
module.exports = {
    settingName: String,
    viewingTerminalBackground: {type: String, required: true},//viewingTerminal Background
    disabled: {type: Boolean},//是否启用
    description: String,
    createdOn: Date,//创建时间
    modifiedOn: Date,//修改时间
    createdBy: String,//创建者ID
    modifiedBy: String //创建者ID
}