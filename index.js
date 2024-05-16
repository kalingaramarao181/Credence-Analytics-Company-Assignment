const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');

const app = express();

// CREATE DATABASE CONNECTION
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'credenceanalytics',
});

//MIDDLEWARE TO UPPLOAD FILES TO UPLOAD FOLDER
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const upload = multer({ storage: storage });

//MIDDLEWARE DOR PARSING JSON
app.use(express.json());

//ACCESSING PATHS FORM 3001(BACKEND) & 3000(FRONTEND)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CRUD ROUTES

// UPDATE MOVIE API
app.put('/movies/:id', upload.single('img'), (req, res) => {
    const { id } = req.params;
    const { name, summary, img } = req.body;
    const imgPath = req.file ? req.file.path : img;
    let sqlQuery = 'UPDATE movies SET name = ?, img = ?, summary = ? WHERE id = ? ';
    const values = [name, imgPath, summary, id]
    db.query(
      sqlQuery, values,
      (error, results) => {
        if (error) {
          res.status(500).json({ error: error.message });
        } else if (results.affectedRows === 0) {
          res.status(404).json({ message: 'Movie not found' });
        } else {
          res.json({ message: 'Movie updated successfully' });
        }
      }
    );
  });

// GET ALL MOVIES API
app.get('/movies', (req, res) => {
    db.query('SELECT * FROM movies', (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.json(results);
      }
    });
  });

//GET MOVIE USING ID API
app.get('/movie/:id', (req, res) => {
    const id = req.params.id
    const sql = "SELECT * FROM movies WHERE id = ?"
    db.query(sql, [id], (err, data) => {
        if (err) return res.json(err)
        return res.json(data[0])
    })
})

// CREATE MOVIE API
app.post('/movies', upload.single('img'), (req, res) => {
  const { name, summary } = req.body;
  const imgPath = req.file.path;
  const sqlQuery = 'INSERT INTO movies (name, img, summary) VALUES (?, ?, ?)'
  db.query(sqlQuery, [name, imgPath, summary], (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(201).json({ message: 'Movie created successfully', id: results.insertId });
      }
    }
  );
});


// DELETE MOVIE API
app.delete('/movies/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM movies WHERE id=?', [id], (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Movie not found' });
      } else {
        res.status(204).send("Movie Deleted Sussfully");
      }
    });
  });

//SERVER RUNNING STATUS
app.listen(3001, () => {
  console.log(`Server is running at http://localhost:3001`);
});
