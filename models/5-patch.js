const db = require("../db/connection");


exports.updateVotes = (review_id, inc_votes) => {
    
    return db.query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then(({ rows }) => {

        if(Number.isNaN( parseInt(inc_votes)) ) {
            return Promise.reject({ status: 400, msg: "Incorrect type" });
        };
        
        const newVotes = rows[0].votes + inc_votes;
        return db.query(`UPDATE reviews SET votes = $1 WHERE review_id = $2 RETURNING *`, [newVotes, review_id]);
    }).then((data) => {
        
        return data.rows[0];
    })

}