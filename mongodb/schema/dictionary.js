/**
 * Created by Steve on 14/8/10.
 */

module.exports = {
    dictionaryGroup: {type: String, required: true},
    dictName: {type: String, required: true},
    orderIndex: {type: Number, required: true},
    remark: {type: String},
    creDatetime: {type: Date, required: true},
    creUser: {type: String, required: true},
    updDatetime: {type: Date, required: true},
    updUser: {type: String, required: true}
}