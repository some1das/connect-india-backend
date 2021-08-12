const User = require("../models/user")
exports.setFollow = (req, res) => {
    const { myId, userId } = req.body
    User.findByIdAndUpdate(myId, {
        $push: {
            following: userId
        }
    }, (err) => {
        if (err) {
            return res.status(400).json({
                error: "something went wrong..."
            })
        }
        else {
            User.findByIdAndUpdate(userId, {
                $push: {
                    followers: myId
                }
            }, (err) => {
                if (err) {
                    return res.status(400).json({
                        error: "problem with following"
                    })


                }
                else {
                    return res.status(200).json({
                        message: "successfully followed"
                    })
                }
            })
        }
    })
}

exports.setUnfollow = (req, res) => {
    const { myId, userId } = req.body
    User.findByIdAndUpdate(myId, {
        $pull: {
            following: userId
        }
    }, (err) => {
        if (err) {
            return res.status(400).json({
                error: "something went wrong..."
            })
        }
        else {
            User.findByIdAndUpdate(userId, {
                $pull: {
                    followers: myId
                }
            }, (err) => {
                if (err) {
                    return res.status(400).json({
                        error: "problem with following"
                    })


                }
                else {
                    return res.status(200).json({
                        message: "successfully unfollowed"
                    })
                }
            })
        }
    })
}

exports.followCheck = (req, res) => {
    const { myId, userId } = req.body
    console.log(req.body)

    User.findById(myId, (err, user) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        else {
            let isMatched = false
            user.following.forEach(element => {
                if (element == userId) {
                    isMatched = true
                }
            });
            if (isMatched)
                res.send(true)
            else
                res.send(false)

        }
    })
}