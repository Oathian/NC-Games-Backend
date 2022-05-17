const { fetchAllCategories } = require("../models/models");

exports.getAllCategories = (req, res, next) => {

    fetchAllCategories().then((categories) => {

        res.status(200).send({ categories });

    });
};
