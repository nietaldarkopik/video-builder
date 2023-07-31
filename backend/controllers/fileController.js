// fileController.js
const utils = require('../models/utils');

exports.getIndex = async (req, res) => {
    const path = req.body.path || false;
    let output = {};
    const data = await utils.listFiles(path);
    res.json({data: data});
};