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
            return Promise.reject({ status: 404, msg: "Resource not found" });
        };
        
        const newVotes = rows[0].votes + inc_votes;
        return db.query(`UPDATE reviews SET votes = $1 WHERE review_id = $2 RETURNING *`, [newVotes, review_id]);
    }).then((data) => {
        
        return data.rows[0];
    })

}

exports.fetchCommentsByReviewId = (review_id) => {

    return db.query(`SELECT * FROM comments WHERE review_id = $1`, [review_id])
    .then(({ rows }) => {

        return rows;
    })
};

exports.fetchAllReviews = (category, sort_by = "created_at", order = "DESC") => {

    const validSortBy = ["created_at", "votes", "comment_count"];

    const validOrder = ["ASC", "DESC"];

    order = order.toUpperCase();

    if(!validOrder.includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid order request" });
    }

    if(!validSortBy.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Invalid sort by request" });
    }

    let queryStr = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id`;
    
    if(category) {
        const removeUnderscore = category.replace("_", " ")
        queryStr += ` WHERE category='${removeUnderscore}'`
    }

    queryStr += ` GROUP BY reviews.review_id`

    if(validSortBy.includes(sort_by) && validOrder.includes(order)) {
        queryStr += ` ORDER BY ${sort_by} ${order}`
    }
    
    return db.query(queryStr)
    .then(({ rows }) => {

        return rows;
    });
};

exports.addComment = ( username, body, review_id ) => {

    if( !username || !body ) {
        return Promise.reject({ status: 400, msg: "Invalid input" })
    };

    return db.query(`INSERT INTO comments ( author, body, review_id ) VALUES ($1, $2, $3) RETURNING *;`, [ username, body, review_id ])
    .then(({ rows }) => {
        
        return rows[0];
    });
};

exports.addReview = ( owner, review_body, title, designer, category ) => {

    if( !owner || !review_body || !title || !designer || !category) {
        return Promise.reject({ status: 400, msg: "Invalid input" })
    };

    return db.query(`INSERT INTO reviews ( owner, review_body, title, designer, category ) VALUES ($1, $2, $3, $4, $5) RETURNING *;`, [ owner, review_body, title, designer, category ])
    .then(({ rows }) => {
        
        return rows[0];
    });
};