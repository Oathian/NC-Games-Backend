const express = require("express");
const { getAllCategories, getReviewById } = require("./controllers/controllers");

const app = express();

app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/categories", getAllCategories);

app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err);
    }
})

app.use("/*", (req, res, next) => {
    res.status(404).send({ msg: "Route not found"});
})

module.exports = app; 