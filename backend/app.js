// app.js
const express = require('express');
const app = express();
const cors = require('cors');
const mainController = require('./controllers/mainController');
const ytController = require('./controllers/ytController');
const fileController = require('./controllers/fileController');

// Set view engine menjadi EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Configure CORS with specific allowed origins
const allowedOrigins = ['*']; // Add your allowed origins here

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

var whitelist = ['http://localhost:3000', 'http://localhost:4000', -1]
var corsOptions3 = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
const corsOptions2 = {
  origin: true,
  credentials: true,
};


// Middleware untuk mem-parsing body permintaan dengan tipe application/json
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json());

// Rute utama yang menangani permintaan GET
app.get('/', mainController.getIndex);
app.get('/youtube/download', ytController.getIndex);
app.get('/youtube/info', ytController.getIndex);
app.get('/play-video', ytController.getPlay);
app.get('/play-audio', ytController.getPlay);
app.get('/file/read', fileController.streamFile);
//app.get('/youtube/build-video', ytController.getBuilder);

app.post('/youtube/download', ytController.getIndex);
app.post('/file/download', ytController.getFile);
app.post('/youtube/info', ytController.getInfo);
app.post('/file-list', fileController.getIndex);
app.post('/file-recursive', fileController.getFilesRecursively);
app.post('/video/info', fileController.getVideoInfo);
app.post('/video/transcript', fileController.getVideoTranscript);
app.post('/youtube/search', ytController.searchYtVideo);
app.post('/video/save-chunks', fileController.buildVideo);

// Jalankan server pada port tertentu
const port = 4000;
app.listen(port, () => {
  console.log(`Server berjalan pada http://localhost:${port}`);
});