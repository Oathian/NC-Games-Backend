const express = require("express");
const { getAllCategories } = require("./controllers/categories.controllers");
const {  getReviewById, addVotes, getCommentsByReviewId, getAllReviews, postComment } = require("./controllers/reviews.controllers");
const {  getAllUsers } = require("./controllers/users.controllers");
const { deleteCommentById } = require("./controllers/comments.controllers")

const app = express();

app.use(express.json());

app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/categories", getAllCategories);
app.get("/api/users", getAllUsers);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.get("/api/reviews", getAllReviews);

app.patch("/api/reviews/:review_id", addVotes);
app.post("/api/reviews/:review_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("/*", (req, res, next) => {
    res.status(404).send({ msg: "Route not found"});
});

app.use((err, req, res, next) => {
    if(err.code === "22P02") {
        res.status(400).send({ msg: "Invalid input" });
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    
    if(err.code === "23503") {

        if(err.constraint.includes("comments_author_fkey")) {

            res.status(404).send({ msg: "Unknown user" });

        } else {

            res.status(404).send({ msg: "Resource not found" });

        }
    } else {
        
        next(err);
    }
});

app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    console.log(err, "<<< uncaught error");
    res.status(500).send({ msg: "internal server error" });
});

module.exports = app; 