const express = require("express");
const { getAllCategories, postCategories } = require("./controllers/categories.controllers");
const { getReviewById, addVotes, getCommentsByReviewId, getAllReviews, postComment, postReview, deleteReviewById } = require("./controllers/reviews.controllers");
const { getAllUsers, getUserByUsername, postUser } = require("./controllers/users.controllers");
const { deleteCommentById, addCommentVotes } = require("./controllers/comments.controllers");
const { getEndpoints } = require("./controllers/controllers");
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/categories", getAllCategories);
app.get("/api/users", getAllUsers);
app.get("/api/users/:username", getUserByUsername);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.get("/api/reviews", getAllReviews);

app.patch("/api/reviews/:review_id", addVotes);
app.patch("/api/comments/:comment_id", addCommentVotes);
app.post("/api/reviews/:review_id/comments", postComment);
app.post("/api/users", postUser);
app.post("/api/reviews", postReview);
app.post("/api/categories", postCategories);
app.delete("/api/comments/:comment_id", deleteCommentById);
app.delete("/api/reviews/:review_id", deleteReviewById);


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

        } else if(err.constraint.includes("reviews_owner_fkey")) {

            res.status(404).send({ msg: "Unknown user" });

        } else {

            res.status(404).send({ msg: "Resource not found" });

        }
    } else if(err.code === "23505") {

        res.status(409).send({ msg: "Username already taken" });

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