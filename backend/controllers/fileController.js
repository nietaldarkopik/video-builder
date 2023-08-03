// fileController.js
const utils = require('../models/utils');
const ytModel = require('../models/ytModel');

exports.getIndex = async (req, res) => {
    const path = req.body.path || false;
    let output = {};
    const data = await utils.listFiles(path);
    res.json({data: data});
};

exports.getFile = async (req, res) => {
    const path = req.query.path || false;
    let output = {};
    const data = await utils.readFile(path);
    res.send(data);
};

exports.getVideoInfo = async (req, res) => {
    const projectid = req.body.projectid || false;
    let output = {};
    const data = await ytModel.configVideo(projectid);
    res.json({data: data});
};

exports.getVideoTranscript = async (req, res) => {
    const projectid = req.body.projectid || false;
    let output = {};
    const data = await ytModel.transcriptVideo(projectid);
    res.json({data: data});
};