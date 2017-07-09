//Structure of database
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: String,
    user_name: String,
    exercises: [{
        exerc_desc: { type: String },
        exerc_dura: { type: String },
        exerc_date: { type: String }
    }]
});

const ModelClass = mongoose.model('userDB', userSchema);

module.exports = ModelClass;