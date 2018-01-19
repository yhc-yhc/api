/**
 * Created by Steve on 14/8/16.
 */

module.export = {
    shortCut: {type: String, required: true, unique: true},
    source: [
        {
            parkId: {type: String},
            useTime: {type: Number}
        }
    ],
    createdOn: {type: Date, required: true},
    createdBy: {type: String, required: true},
    modifiedOn: {type: Date, required: true},
    modifiedBy: {type: String, required: true}
}
