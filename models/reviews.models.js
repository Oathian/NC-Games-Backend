const db = require("../db/connection");

exports.fetchReviewById = (review_id) => {

    if(Number.isNaN( parseInt( review_id ))) {
        return Promise.reject({ status: 400, msg: "Invalid ID"});
    }

    return db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then(({ rows }) => {

        if(rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Resource not found"});
        }
        
        return rows[0];
    });
};

exports.updateVotes = (review_id, inc_votes) => {

    if(Number.isNaN( parseInt( review_id ))) {
        return Promise.reject({ status: 400, msg: "Invalid ID"});
    };

    if(Number.isNaN( parseInt( inc_votes )) ) {
        return Promise.reject({ status: 400, msg: "Incorrect type" });
    };
    
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