const express = require("express");
const { getAllCategories, addVotes } = require("./controllers/controllers");

const app = express();

app.get("/api/categories", getAllCategories);

app.patch("/api/reviews/:review_id", addVotes);

app.use("/*", (req, res) => {
    res.status(404).send({ msg: "Route not found"})
})

module.exports = app;