const { fetchReviewById, updateVotes, fetchCommentsByReviewId, fetchAllReviews, addComment } = require("../models/reviews.models");
const { fetchAllCategories } = require("../models/categories.models")

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

    const promiseArray = [fetchCommentsByReviewId(review_id)];

    if(review_id) {
        promiseArray.push(fetchReviewById(review_id));
    };

    Promise.all(promiseArray).then(([ comments ]) => {

        res.status(200).send({ comments });

    }).catch((err) => {

        next(err);
    })
}

exports.getAllReviews= (req, res, next) => {

    const { category, sort_by, order } = req.query;

    const promiseArray = [fetchAllReviews(category, sort_by, order)];

    if(category) {
        promiseArray.push(fetchAllCategories());
    }
    
    Promise.all(promiseArray).then(( [ reviews, categories ] ) => {

        if(category !== undefined) {

            let arr = [];

            categories.forEach((element) => {
                arr = arr.concat(Object.values(element));
            })

            const removeUnderscore = category.replace("_", " ")

            if(!arr.includes(removeUnderscore)) {

                return Promise.reject({ status: 404, msg: "Resource not found" });
            }
        }
        res.status(200).send({ reviews });

    }).catch((err) => {

        next(err);
    });
};

exports.postComment = (req, res, next) => {

    const { review_id } = req.params;

    const { username, body } = req.body;

    addComment( username, body, review_id ).then(( comment ) => {

        res.status(201).send({ comment });

    }).catch((err) => {

        next(err);
    })
};