const { updateVotes } = require("../models/5-patch");

exports.addVotes = (req, res, next) => {

    const { inc_votes } = req.body;

    const { review_id } = req.params;

    updateVotes(review_id, inc_votes).then((review) => {

        res.status(200).send({ review })

    }).catch((err) => {

        next(err);
    })
}