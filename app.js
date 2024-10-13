const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware to serve static files and parse JSON body
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Folder to store notes
const notesDir = path.join(__dirname, 'notes');

// Ensure notes folder exists
if (!fs.existsSync(notesDir)) {
  fs.mkdirSync(notesDir);
}

// API to load a note by filename
app.get('/api/notes/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(notesDir, filename);
  if (fs.existsSync(filepath)) {
    fs.readFile(filepath, 'utf-8', (err, data) => {
      if (err) return res.status(500).json({ error: 'Error reading file' });
      res.json({ content: data });
    });
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// API to save a note
app.post('/api/notes', (req, res) => {
  const { filename, content } = req.body;
  if (!filename || !content) {
    return res.status(400).json({ error: 'Filename and content are required' });
  }

  const filepath = path.join(notesDir, filename);
  fs.writeFile(filepath, content, (err) => {
    if (err) return res.status(500).json({ error: 'Error saving file' });
    res.status(200).json({ message: 'File saved successfully' });
  });
});

// API to list all notes
app.get('/api/notes', (req, res) => {
  fs.readdir(notesDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Error reading directory' });
    res.json(files);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
