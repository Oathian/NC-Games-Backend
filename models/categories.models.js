const db = require("../db/connection");

exports.fetchAllCategories = () => {

    let queryStr = `SELECT * FROM categories;`;

    return db.query(queryStr).then((categories) => {

        return categories.rows;
    });
};

exports.addCategories = ( slug, description ) => {

    if( !slug || !description ) {
        return Promise.reject({ status: 400, msg: "Invalid input" })
    };

    return db.query(`INSERT INTO categories ( slug, description ) VALUES ($1, $2) RETURNING *;`, [ slug, description ])
    .then(({ rows }) => {
        
        return rows[0];
    });
};