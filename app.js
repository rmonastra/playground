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
        let username = results.user_name
        let id = results._id
        let fromDate = new Date(req.query.fromDate) || fromDate.getTime()
        let toDate = new Date(req.query.toDate) || Date.now
        let limit = req.query.limit || 10
        
        console.log(id)
        if (err) return console.error(err);     
        
        Exercise
        .find({
            userId: id,
            date: {$gt: fromDate, $lt: toDate}
         })
        .limit(limit)
        .sort({date: -1})
        .exec((err, data) =>{

            res.json({
                userId: id,
            date: {$gt: fromDate, $lt: toDate},
            exerc_date: data.fromDate
               /*  userId: id,
                user_name: username,
                count: data.length,
                log: data.map(event => ({
                exerc_desc : event.exerc_desc,
                exerc_dura : event.exerc_dura,
                exerc_date: event.exerc_date.toDateString() */
         /* })
        )*/
            })      
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
})