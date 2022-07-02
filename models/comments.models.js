const db = require("../db/connection");

exports.removeCommentById = (comment_id) => {

    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
    .then((result) => {
        if(result.rowCount === 0) {
            return Promise.reject({ status: 404, msg: "Resource not found" });
        } 
        if(result.rowCount === 1) {
            return;
        }
    });
};

exports.patchCommentVotes = (comment_id, inc_votes) => {

    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {

        if(rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Resource not found" });
        }

        const newVotes = rows[0].votes + inc_votes;

        return db.query(`UPDATE comments SET votes = $1 WHERE comment_id = $2 RETURNING *`, [newVotes, comment_id]);
    }).then((data) => {
        
        return data.rows[0];
    })
};