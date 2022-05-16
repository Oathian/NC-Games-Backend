const express = require("express");
const { getAllCategories } = require("./controllers/controllers");

const app = express();

app.get("/api/categories", getAllCategories);

app.use("/*", (req, res) => {
    res.status(404).send({ msg: "Route not found"})
})

module.exports = app;