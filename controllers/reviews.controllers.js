const { fetchReviewById, updateVotes, fetchAllReviews } = require("../models/reviews.models");

exports.getReviewById = (req, res, next) => {

    const { review_id } = req.params;

    fetchReviewById(review_id).then((review) => {

        res.status(200).send({ review });
        
    }).catch((err) => {
        next(err);
    });
};

exports.addVotes = (req, res, next) => {

    const { inc_votes } = req.body;

    const { review_id } = req.params;

    updateVotes(review_id, inc_votes).then((review) => {

        res.status(200).send({ review })

    }).catch((err) => {

        next(err);
    })
};

exports.getAllReviews= (req, res, next) => {

    fetchAllReviews().then((reviews) => {

        res.send(200).send({ reviews });

    }).catch((err) => {
        next(err);
    });
};