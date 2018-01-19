/**
 * Created by Steve on 7/28/15.
 */

module.exports = {
    cType: {type: String, unique: true, index: true},    //如中文，或者英文，代码是 cn 或者是 en
    cText: [{
        cCode: String,//语言代码，如 u0001
        cValue: String //语言的文本，如中文是 购物车，英语是cart
    }],

    remark: {type: String},    //备注
    createdOn: Date,//创建时间
    modifiedOn: Date,//修改时间
    createdBy: String,//创建者ID
    modifiedBy: String //创建者ID
}

//   {{ lan[3].cText[].cVaule }}
