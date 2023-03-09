const http = require('http');
const express = require('express');
require('dotenv').config({path: 'weights.env'});
const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/test.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory IHRU database in index.');
});
var cors = require('cors');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS result (test_id INTEGER PRIMARY KEY AUTOINCREMENT, resp_id INTEGER NOT NULL, answer TEXT NOT NULL, distress INTEGER NOT NULL, physical_discomfort INTEGER NOT NULL, cognitive_discomfort INTEGER NOT NULL, emotional_violation INTEGER NOT NULL, motivation_decrease INTEGER NOT NULL, quiz_id INTEGER, timestamp DATETIME DEFAULT (datetime('now','localtime')) NOT NULL)`,
    (err) => {
        if (err) {
            console.error(err.message);
            console.log("Closing app");
            db.close();
            process.exit(1);
        }
        console.log('Created/Opened table result in the in-memory IHRU database.');
    });
    db.close();
});
const testRouter = require('./routers/test');
const resultRouter = require('./routers/result');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(testRouter);
app.use(resultRouter);
server.listen(port, () => {
    console.log('Server is up! on port ' + port);
});