const { fetchAllCategories, addCategories } = require("../models/categories.models");

exports.getAllCategories = ( req, res, next ) => {

    fetchAllCategories().then((categories) => {

        res.status(200).send({ categories });

    }).catch((err) => {

        next(err);
    });
};

exports.postCategories = ( req, res, next ) => {

    const { slug, description } = req.body;

    addCategories( slug, description ).then((category) => {

        res.status(201).send({ category });

    }).catch((err) => {

        next(err);
    });
};