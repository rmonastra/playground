const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const mongodb = require('mongodb').MongoClient();
const Exercise = require("./models/exercise");
const User = require("./models/user");
//const dotenv = require("dotenv").config();
const randomstring = require("randomstring");

mongoose.connect( /* process.env.MONGOLAB_URI || */ 'mongodb://localhost/exercises')

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

app.get("/api/exercise/users", (req, res) => {
    User.find({}, (err, results) => {
        res.json(results)
    })
})

app.get("/api/exercise/log/", (req, res) => {

    let user = req.query.userIdGet


    if (req.query.userIdGet === "") {
        res.json({
            error: "User Id required"
        })
    }
    userDB.findById(req.query.userIdGet, (err, doc) => {

    })
})


app.post("/api/exercise/new-user", (req, res) => {
    let username = req.body.username;
    let idUser = randomstring.generate(6);

    User.findOne({ "user_name": { $eq: username } }, (err, doc) => {

        if (username === "") {
            res.json({
                error: "Username required"
            })
        } else if (doc) {
            return res.send('User already exists')
        } else {
            let newUser = new User({
                user_name: username,
                _id: idUser
            })
            newUser.save((err, doc) => {
                res.json({
                    user_name: username,
                    _id: idUser
                })
            })
        }
    })
})


app.post("/api/exercise/add/", (req, res, next) => {

    User.findById(req.body.userId, (err, doc) => {

        if (req.body.userId === "") {
            res.json({
                error: "User Id required"
            })
        } else {

            let username = doc.user_name
            let newExercise = new Exercise({
                userId: req.body.userId,
                user_name: username,
                exerc_desc: req.body.description,
                exerc_dura: req.body.duration,
                exerc_date: req.body.date
            })

            newExercise.save((err, doc) => {
                if (err) return (err)
                res.json({
                    userId: req.body.userId,
                    user_name: username,
                    exerc_desc: req.body.description,
                    exerc_dura: req.body.duration,
                    exerc_date: req.body.date
                })
            })
        }

    })

})

//Listen on connection port
let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening on port: " + port);
});