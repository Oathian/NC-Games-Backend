const { reduce } = require("../db/data/test-data/comments");
const { fetchReviewById, updateVotes, addComment } = require("../models/reviews.models");

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
}

exports.postComment = (req, res, next) => {

    const { review_id } = req.params;

    const { username, body } = req.body;

    addComment( username, body, review_id ).send(({ comment }) => {

        reduce.status(201).send({ comment });

    }).catch((err) => {

        next(err);
    })
}