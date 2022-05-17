const db = require("../db/connection");

exports.fetchReviewById = (review_id) => {

    const reviewObject = db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then(({ rows }) => {

        if(rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Resource not found"});
        }
        
        return rows[0];
    });

    const commentCount = db.query(`SELECT * FROM comments WHERE review_id = $1`, [review_id])
    .then(({ rows }) => {
        console.log(rows);
        return rows.length;
    })

    Promise.all([reviewObject, commentCount])
    .then(([reviewObject, commentCount]) => {
        reviewObject["comment_count"] = commentCount;
        return reviewObject;
    })
};

exports.updateVotes = (review_id, inc_votes) => {

    return db.query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then(({ rows }) => {

        if(rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Resource not found" })
        };
        
        const newVotes = rows[0].votes + inc_votes;
        return db.query(`UPDATE reviews SET votes = $1 WHERE review_id = $2 RETURNING *`, [newVotes, review_id]);
    }).then((data) => {
        
        return data.rows[0];
    })

}