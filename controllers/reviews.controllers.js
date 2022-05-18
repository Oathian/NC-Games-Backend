const { fetchReviewById, updateVotes, fetchCommentsByReviewId } = require("../models/reviews.models");

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

        res.status(200).send({ review });

    }).catch((err) => {

        next(err);

    });
};

exports.getCommentsByReviewId = (req, res, next) => {

    const { review_id } = req.params;

    fetchCommentsByReviewId(review_id).then((comments) => {

        res.status(200).send({ comments });

    }).catch((err) => {

        next(err);
    });
};