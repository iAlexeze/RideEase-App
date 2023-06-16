const express = require('express');
const { Pool } = require('pg');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { host } = require('pg/lib/defaults');
const app = express();
const port = 3000;

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'db',
  password: 'postgres',
  port: 5432,
});

// Store the fetched data in a variable
let fetchedData = [];

// Create a PostgreSQL connection
const postgresHost = 'postgres';
const postgresPort = '5432';

pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
    process.exit(1); // Terminate the application on connection error
  } else {
    console.log(`PostgreSQL connected to ${postgresHost}:${postgresPort}`);
  }
});

// Generate alphanumeric ID with a length of 3 characters
function generateID() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }
  return id;
}

// Fetch data from the PostgreSQL database
app.get('/data', (req, res) => {
  pool.query('SELECT id, name, email, created_at FROM rideease', (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.sendStatus(500);
      return;
    }

    try {
      fetchedData = result.rows.map((row) => ({
        id: generateID(5),
        name: row.name,
        email: row.email,
        password: row.password,
        created_at: row.created_at
      }));
      res.json(fetchedData);
    } catch (err) {
      console.error('Error processing fetched data:', err);
      res.sendStatus(500);
    }
  });
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Download data as PDF
app.get('/download', (req, res) => {
  const data = fetchedData; // Use the stored data

  // Create a new PDF document
  const doc = new PDFDocument();

  // Pipe the document to a writable stream
  const stream = fs.createWriteStream('data.pdf');
  doc.pipe(stream);

  // Write data to the document
  doc.fontSize(16).text('Data from PostgreSQL Database', { underline: true });
  doc.moveDown();
  data.forEach((row) => {
    doc.text(`ID: ${row.id}, Name: ${row.name}, Email: ${row.email}, Time: ${row.created_at}`);
  });

  // Finalize the document
  doc.end();

  // Set the response headers to download the PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=rideeasedata.pdf');

  // Stream the PDF to the response
  stream.on('finish', () => {
    fs.createReadStream('data.pdf')
      .on('error', (err) => {
        console.error('Error reading the PDF file:', err);
        res.sendStatus(500);
      })
      .pipe(res);
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Internal server error:', err);
  res.sendStatus(500);
});

// Start the server
app.listen(port, () => {
  console.log(`Admin dashboard listening at http://${host}:${port}`);
});
