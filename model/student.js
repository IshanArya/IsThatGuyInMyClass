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
    username: String,
    password: String,
    name: String,    
    classes: []
});

var Student = mongoose.model('Student', studentSchema);
module.exports = Student;
