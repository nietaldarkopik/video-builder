// app.js
const express = require('express');
const app = express();
const mainController = require('./controllers/mainController');

// Set view engine menjadi EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Middleware untuk mem-parsing body permintaan dengan tipe application/json
app.use(express.json());

// Rute utama yang menangani permintaan GET
app.get('/', mainController.getIndex);

// Jalankan server pada port tertentu
const port = 3000;
app.listen(port, () => {
  console.log(`Server berjalan pada http://localhost:${port}`);
});