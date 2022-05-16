const { fetchAllCategories, updateVotes } = require("../models/models");

exports.getAllCategories = (req, res, next) => {

    fetchAllCategories().then((categories) => {

        res.status(200).send({ categories });

    });
};

exports.addVotes = (req, res, next) => {

    const { inc_votes } = req.body;

    updateVotes(inc_votes).then((review) => {

        res.status(200).send({ review })

    })
}