const express = require("express");
const { getReviewById } = require("./controllers/getReviewByIdController");

const app = express();

app.get("/api/reviews/:review_id", getReviewById);

app.use((err, req, res, next) => {
    res.status(err.status).send({ msg: err.msg })
})

module.exports = app; 