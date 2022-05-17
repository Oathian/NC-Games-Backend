const express = require("express");

const { getAllCategories } = require("./controllers/categories.controllers");
const {  getReviewById, addVotes } = require("./controllers/reviews.controllers");

const app = express();

app.use(express.json());

app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/categories", getAllCategories);

app.patch("/api/reviews/:review_id", addVotes);

app.all("/*", (req, res, next) => {
    res.status(404).send({ msg: "Route not found"});
});

app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    if(err.code === "22P02") {
        res.status(400).send({ msg: "Invalid input" });
    }
})

app.use((err, req, res, next) => {
    console.log(err, "<<< uncaught error");
    res.status(500).send({ msg: "internal server error" });
});

module.exports = app; 