const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/test.db', (err) => {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }
});

exports.findConcreteById = async (test_id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT resp_id as respondent_id, distress, physical_discomfort, cognitive_discomfort, emotional_violation, motivation_decrease, quiz_id, unixepoch(timestamp) as datetime FROM result WHERE test_id = ?', [test_id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

exports.findAllByRespId = async (resp_id) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM result WHERE resp_id = ?', [resp_id], (err, rows) =>  { 
            if (err) {
                reject(err);
            }
            let resultSet = [];
            rows.forEach(function (row) {  
                resultSet.push(row);
            });
            resolve(resultSet);
        });
    });
};

exports.findByTimestamp = async (timestamp) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT test_id, resp_id as respondent_id, unixepoch(timestamp) as datetime, quiz_id FROM result WHERE unixepoch(timestamp) >= ?', [timestamp], (err, rows) =>  { 
            if (err) {
                reject(err);
            }
            let resultSet = [];
            rows.forEach(function (row) {  
                resultSet.push(row);
            });
            resolve(resultSet);
        });
    });
};