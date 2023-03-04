const Test = require('../models/test');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/test.db', (err) => {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }
});

exports.save = async (req, res) => {
    try {
        const result_id = await Test.save(req.body.answer, req.id, req.body.quiz_id);
        res.status(200).send({result_id : result_id});
    } catch (e) {
        res.status(400).send({error : e.message});
    }
};