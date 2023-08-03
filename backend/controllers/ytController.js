// mainController.js
const ytModel = require('../models/ytModel');
const path = require('path');
const utils = require('../models/utils');
const pathMaster = '../videos/master/';

const getIndex = async (req, res) => {
  let url = req.query.url || false;
  url = url || req.body.url;
  const projectName = utils.generateUniqueTimestamp();
  const data = await ytModel.downloadVideo(url, false, projectName); // Model Download Video Youtube

  //res.render('youtube', { data }); // Menampilkan data menggunakan view
  res.json({ data: data });
};

const getInfo = async (req, res) => {
  let url = req.query.url || false;
  url = url || req.body.url;
  const data = await ytModel.infoVideo(url); // Mendapatkan data dari model
  //res.render('youtube', { data }); // Menampilkan data menggunakan view
  res.json({ data: data });
};

const getPlay = async (req, res) => {
  let qpath = req.query.path || false;
  qpath = utils.decode64(qpath);
  const videoPath = path.join(__dirname, '../', qpath);
  res.sendFile(videoPath);
};

const getFile = async (req, res) => {
  const body = req.body;
  let format = body.format || false;
  format = (format) ? JSON.parse(format) : format;
  let url = body.url || format.url || false;
  let videodetails = body.videodetails || false;
  let ext = format.container || false;
  videodetails = (videodetails) ? JSON.parse(videodetails) : videodetails;
  let filename = videodetails.title || 'apaaja';
  let path = body.path || pathMaster;

  const projectName = utils.generateUniqueTimestamp();
  const projectDir = path + projectName + '/';
  //console.log(body.player_response);//.captions.playerCaptionsTracklistRenderer.captionTracks;
  const transcripts = (!body.player_response) ? [] : JSON.parse(body.player_response);

  const thumbnails = videodetails.thumbnails;
  const storyboards = videodetails.storyboards[0];
  await ytModel.createDirectory(projectDir);
  const data = await ytModel.downloadFile(url, projectDir + projectName + '.' + ext); //download video

  await ytModel.saveFile(projectDir, projectName + '.json', JSON.stringify(body)); //save all data video

  if (Array.isArray(transcripts) && transcripts.length > 0) {
    transcripts.forEach(async (v, i) => {
      //Object.entries(v).forEach(([key,value]) => {
      const baseUrl = v.baseUrl;
      await ytModel.downloadFile(baseUrl, projectDir + 'transcript-' + projectName + '-' + i + '.xml');
      //});
    })
  }
  if (storyboards.templateUrl) {
    await ytModel.downloadFile(storyboards.templateUrl, projectDir + 'storyboards-' + projectName + '-0' + '.jpg');
  }

  if (Array.isArray(thumbnails) && thumbnails.length > 0) {
    thumbnails.forEach(async (v, i) => {
      //Object.entries(v).forEach(([key,value]) => {
      const baseUrl = v.url;
      await ytModel.downloadFile(baseUrl, projectDir + 'thumbnail-' + projectName + '-' + i + '.jpg');
      //});
    })
  }

  res.send(data);
  //res.render('youtube', { data }); // Menampilkan data menggunakan view
};

module.exports = {
  getIndex,
  getFile,
  getPlay,
  getInfo
}