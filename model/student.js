var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/** Class:
 * {
 *  id: String,
 *  period: String,
 *  teacher: String,
 *  room: String
 * }
*/

var studentSchema = new Schema({
    email: String,
    password: String,
    verified: Boolean,
    admin: Boolean,
    name: String,
    classes: []
});

studentSchema.methods.findFriends = function (callback) {
    // this is probably so damn inefficient
    // but this is just verison 1.0 so lmao
    var hasNames = false;
    var myClasses = this.classes.slice(0);
    this.model('Student').find({
        name: {
            $ne: this.name
        }
    }, function (err, res) {
        //console.log(res);
        if (err) {
            callback(null); // idk why this would happen
        } else {
            var friends = new Array(12);
            for (var i = 0; i < 12; i++) {
                friends[i] = [];
            }

            for (var i = 0; i < res.length; i++) {
                for (var j = 0; j < 12; j++) {
                    if (res[i].classes.length > 0) {
                        if (res[i].classes[j].toUpperCase() == myClasses[j].toUpperCase()) {
                            friends[j].push({
                                name: res[i].name,
                                id: res[i].id
                            });
                            hasNames = true;
                        }
                    }
                }
            }

            callback(hasNames, friends);
        }
    });
};

var Student = mongoose.model('Student', studentSchema);
module.exports = Student;
