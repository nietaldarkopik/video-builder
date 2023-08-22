// fileController.js
const utils = require('../models/utils');
const ytModel = require('../models/ytModel');
const splitter = require('../models/splitter');
const fs = require('fs');
const pathFs = require('path');

exports.getIndex = async (req, res) => {
    const path = req.body.path || false;
    let output = {};
    const data = await utils.listFiles(path);
    res.json({ data: data });
};

exports.getFilesRecursively = async (req, res) => {
    const path = req.body.path || false;
    const data = await utils.getFilesRecursively(path);
    res.json({ data: data });
}


exports.getFile = async (req, res) => {
    const path = req.query.path || false;
    let output = {};
    const data = await utils.readFile(path);
    res.send(data);
};


exports.streamFile = async (req, res) => {
    const path = req.query.path || false;
    const data = await pathFs.join(__dirname, '../', utils.front_decode64(path));
    console.log(data)
    res.sendFile(data);
};

exports.getVideoInfo = async (req, res) => {
    const projectid = req.body.projectid || false;
    let output = {};
    const data = await ytModel.configVideo(projectid);
    res.json({ data: data });
};

exports.buildVideo = async (req, res) => {
    const chunks = req.body.chunks || false;
    const data = await splitter.buildVideo(chunks);
    res.json({ data: data });
};

exports.getVideoTranscript = async (req, res) => {
    const projectid = req.body.projectid || false;
    let output = {};
    const data = await ytModel.transcriptVideo(projectid);
    res.json({ data: data });
};