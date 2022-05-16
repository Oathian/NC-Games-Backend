const db = require("../db/connection");

exports.fetchAllCategories = () => {

    let queryStr = `SELECT * FROM categories;`;

    return db.query(queryStr).then((categories) => {

        return categories.rows;
    });
};

exports.updateVotes = () => {

    
}