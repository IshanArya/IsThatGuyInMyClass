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
    verfieid: boolean,
    name: String,
    classes: []
});

var Student = mongoose.model('Student', studentSchema);
module.exports = Student;
