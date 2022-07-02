const db = require("../db/connection");

exports.fetchAllUsers = () => {
    
    return db.query(`SELECT * FROM users;`)
    .then(({ rows }) => {
        return rows;
    })
};

exports.fetchUserByUsername = (username) => {

    return db.query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({ rows }) => {

        if(rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Resource not found"});
        }
        
        return rows[0];
    });
};

exports.addUser = ( username, name, avatar_url ) => {

    if( !username || !name || !avatar_url) {
        return Promise.reject({ status: 400, msg: "Invalid input" })
    };

    return db.query(`INSERT INTO users ( username, name, avatar_url ) VALUES ($1, $2, $3) RETURNING *;`, [ username, name, avatar_url ])
    .then(({ rows }) => {
        
        return rows[0];
    });
};