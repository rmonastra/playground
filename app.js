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
        if (err) return console.error(err);
        res.json(results)
    })
})

app.get("/api/exercise/log/", (req, res) => {

    if (req.query.userIdGet === "") {
        res.json({
            error: "User Id required"
        })
    }
    User.findById(req.query.userIdGet, (err, results) => {
        let fromDate = new Date(req.query.fromDate)
        let toDate = new Date(req.query.toDate)
        let limit = req.query.limit

        if (err) return console.error(err);     
        
        Exercise.find({
            userId: req.query.userIdGet/* ,
            date: {$gt: fromDate, $lt: toDate},
            limit: limit */
         }).exec((err, results)=>{
             if (err) return console.error(err);
             res.json(results)
         })      
    })
})


app.post("/api/exercise/new-user/", (req, res) => {
    let username = req.body.username;
    let idUser = randomstring.generate(6);

    User.findOne({ "user_name": { $eq: username } }, (err, doc) => {
        if (err) return console.error(err);
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
                if (err) return console.error(err);
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
 if (err) return console.error(err);
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
                if (err) return console.error(err);
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