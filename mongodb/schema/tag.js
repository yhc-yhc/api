/**
 * Created by Steve on 14/10/9.
 */

module.exports ={
    fileName:{type:String,required:true},
    cus:{type:String,required:true},
    time:{type:String},
    location:{type:String},
    fav:{type:String},
    pay:{type:String},
    targetPoint:{type:String},
    shotBy:{type:String},
    magicShot:{type:String},
    status:{type:Number},
    createdOn:{type:Date,required:true},
    createdBy:{type:String,required:true},
    modifiedOn:{type:Date,required:true},
    modifiedBy:{type:String,required:true}
}
