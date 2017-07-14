const mongoose = require('mongoose')
const Schema = mongoose.Schema
    //const User = require("./models/user")




const exerciseSchema = new Schema({
    user_name: {
        type: String
    },
    userId: {
        type: String,
        index: true,
        ref: "User"
    },
    exerc_desc: {
        type: String,
        required: true
    },
    exerc_dura: {
        type: Number,
        required: true
    },
    exerc_date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

var Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;