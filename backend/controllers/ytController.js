// mainController.js
const ytModel = require('../models/ytModel');
const path = require('path');

const getIndex = async (req, res) => {
  let url = req.query.url || false;
  url = url || req.body.url;
  const data = await ytModel.downloadVideo(url); // Mendapatkan data dari model
  //res.render('youtube', { data }); // Menampilkan data menggunakan view
  res.json({data : data});
};

const getInfo = async (req, res) => {
  let url = req.query.url || false;
  url = url || req.body.url;
  const data = await ytModel.infoVideo(url); // Mendapatkan data dari model
  //res.render('youtube', { data }); // Menampilkan data menggunakan view
  res.json({data : data});
};

const getPlay = async (req, res) => {
  let qpath = req.query.path || false;
  const videoPath = path.join(__dirname, qpath);
  res.sendFile(videoPath);
};

const getFile = async (req, res) => {
  const body = req.body;
  let url = body.url || false;
  let videodetails = body.videodetails || false;
  let ext = body.container || false;
  videodetails = (videodetails)? JSON.parse(videodetails) : videodetails;
  let filename = videodetails.title || 'apaaja';
  const path = '../videos/master/'+filename+'.'+ext;
  const data = await ytModel.downloadFile(url,path); // Mendapatkan data dari model
  res.send(data);
  //res.render('youtube', { data }); // Menampilkan data menggunakan view
};

module.exports = {
  getIndex,
  getFile,
  getPlay,
  getInfo
}