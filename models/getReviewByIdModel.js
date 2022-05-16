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

        if(rows[0].review_img_url) {
            rows[0].review_img_url = "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg"
        };
        
        if(rows[0].votes) {
            rows[0].votes = 0;
        };

        if(rows[0].created_at) {
            rows[0].created_at = Date.now();
        };
        
        return rows[0];
    });
};