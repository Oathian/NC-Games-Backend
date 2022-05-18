const db = require("../db/connection");

exports.fetchReviewById = (review_id) => {

    return db.query(`SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id HAVING reviews.review_id = $1;`, [review_id])
    .then(({ rows }) => {

        if(rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Resource not found"});
        }
        
        return rows[0];
    });
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

exports.addComment = ( username, body, review_id ) => {
    return db.query(`INSERT INTO comments ( author, body, review_id ) VALUES ($1, $2, $3) RETURNING *;`, [ username, body, review_id ])
    .then(({ rows }) => {
        
        return rows[0];
    })
}