const { fetchAllCategories, fetchReviewById } = require("../models/models");

exports.getAllCategories = (req, res, next) => {

    fetchAllCategories().then((categories) => {

        res.status(200).send({ categories });

    }).catch((err) => {
        next(err);
    });
};

exports.getReviewById = (req, res, next) => {

    const { review_id } = req.params;

    fetchReviewById(review_id).then((review) => {

        res.status(200).send({ review });
        
    }).catch((err) => {
        next(err);
    });
};