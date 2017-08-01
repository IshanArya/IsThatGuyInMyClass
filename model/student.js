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
    id: String,
    name: String,
    grade: Number,
    classes: []
});

var Student = mongoose.model('Student', studentSchema);
module.exports = Student;
