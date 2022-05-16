const db = require("../db/connection");

exports.fetchReviewById = (review_id) => {

    if(Number.isNaN( parseInt( review_id ))) {
        return Promise.reject({ status: 400, msg: "Invalid ID"});
    }

    return db.query(`SELECT * FROM reviews WHERE review_id = $1;`,[review_id])
    .then(({ rows }) => {

        if(rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Resource not found"});
        }

        return rows[0];
    });
};