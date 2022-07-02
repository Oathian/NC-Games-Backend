const { removeCommentById, patchCommentVotes } = require("../models/comments.models.js");

exports.deleteCommentById = (req, res, next) => {

    const { comment_id } = req.params;

    removeCommentById(comment_id).then(() => {

        res.status(204).end();

    }).catch((err) => {
        next(err);
    })

}

exports.addCommentVotes = (req, res, next) => {

    const { inc_votes } = req.body;

    const { comment_id } = req.params;

    patchCommentVotes(comment_id, inc_votes).then((newComment) => {

        res.status(200).send({ newComment });

    }).catch((err) => {
        next(err);
    })
}