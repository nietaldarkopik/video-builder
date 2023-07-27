// mainController.js
const mainModel = require('../models/mainModel');

exports.getIndex = (req, res) => {
  const data = mainModel.getData(); // Mendapatkan data dari model
  res.render('index', { data }); // Menampilkan data menggunakan view
};