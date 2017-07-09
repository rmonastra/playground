const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const mongodb = require('mongodb').MongoClient();
const userDB = require("./models/userDB");
//const dotenv = require("dotenv").config();
const path = require('path');
const randomstring = require("randomstring");

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/userdbs')

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

app.get("/api/exercise/log/", (req, res) => {

    let user = req.query.userIdGet
    let from_date = new Date(req.query.fromDate) || 'Invalid Date'
    let to_date = new Date(req.query.toDate) || 'Invalid Date'
    let query_limit = parseInt(req.query.limit) || 1

    userDB.findById(user, (err, doc) => {
        if (doc) {
            userDB.find({
                _id: user,
                user_name: doc.user_name,
                exerc_date: {
                    $lt: to_date != 'Invalid Date' ? to_date.getTime() : Date.now(),
                    $gt: from_date != 'Invalid Date' ? from_date.getTime() : 0
                },
                limit: query_limit
            })
            res.json({
                _id: doc._id,
                user_name: doc.user_name,
                exerc_desc: doc.exerc_desc,
                exerc_dura: doc.exerc_dura,
                exerc_date: doc.exerc_date
            })
        } else {
            res.json({
                error: "user id not found"
            })
        }
    })

})

app.post("/api/exercise/new-user/", (req, res) => {
    let username = req.body.username;
    let idUser = randomstring.generate(6);

    userDB.findOne({ "user_name": { $eq: username } }, (err, doc) => {

        if (username === "") {
            res.json({
                error: "Username required"
            })
        } else if (doc) {
            return res.send('User already exists')
        } else {
            let newUser = new userDB({
                user_name: username,
                _id: idUser
            });
            newUser.save((err, doc) => {
                res.json({
                    user_name: username,
                    _id: idUser
                })
            });
        }
    });
});

app.post("/api/exercise/add/", (req, res) => {
    let user = req.body.userId

    userDB.findOne({ "_id": { $eq: user } }, (err, doc) => {

        if (doc) {

            userDB.update({

                /*exercises: {
                    $each: [{ exerc_desc: req.body.description }, { exerc_dura: req.body.duration }, { exerc_date: req.body.date }]
                }*/

                exercise: [{
                    exerc_desc: req.body.description,
                    exerc_dura: req.body.duration,
                    exerc_date: req.body.date
                }]



            })
            doc.save();
            res.json(doc)

        } else {
            res.json({
                error: "user id not found"
            })
        }

    });

});


//Listen on connection port
let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening on port: " + port);
});