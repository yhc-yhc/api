/**
 * Created by Steve on 14/10/9.
 */

module.exports = {
    photoCode: String,
    storyInfo: [{
        startTime: Date,
        endTime: Date,
        makingBy: String
    }],
    state: {type: Boolean, default: false}

}
