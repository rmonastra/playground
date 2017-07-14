//Structure of database
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: {
        type: String,
        index: true
    },
    user_name: {
        type: String,
        unique: true,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;