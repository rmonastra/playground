app.get("/api/exercise/log/", (req, res) => {

    let user = req.query.userIdGet
    let from_date = new Date(req.query.fromDate) || 'Invalid Date'
    let to_date = new Date(req.query.toDate) || 'Invalid Date'
    let query_limit = parseInt(req.query.limit) || 1

    Exercise.findById(user, (err, doc) => {
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

app.post("/api/exercise/add/", (req, res) => {
    let user = req.body.userId
    let description = req.body.description
    let duration = req.body.duration
    let date = req.body.date

    Exercise.findOne({ "_id": { $eq: user } }, (err, doc) => {

        if (doc) {

            let username = doc.user_name
            let newExercise = new Exercise({
                user_name: username,
                _id: user,
                exerc_desc: description,
                exerc_dura: duration,
                exerc_date: date
            })

            newExercise.save((err, doc) => {
                res.json(newExercise)
            })
        } else {
            res.json({
                error: "user id not found"
            })
        }

    });

});