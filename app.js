const express = require("express");
const { getAllCategories, getReviewById } = require("./controllers/controllers");

const app = express();

app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/categories", getAllCategories);

app.all("/*", (req, res, next) => {
    res.status(404).send({ msg: "Route not found"});
});

app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err);
    };
});

app.use((err, req, res, next) => {
    console.log(err, "<<< uncaught error");
    res.status(500).send({ msg: "internal server error" });
});


module.exports = app; 