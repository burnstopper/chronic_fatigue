require('dotenv').config({path: '../weights.env'});
const weights = JSON.parse(process.env.WEIGHTS);
const physicalDiscomfortQuestions = Array(JSON.parse(process.env.PHYSICAL_DISCOMFORT))[0];
const cognitiveDiscomfortQuestions = Array(JSON.parse(process.env.COGNITIVE_DISCOMFORT))[0];
const emotionalViolationQuestions = Array(JSON.parse(process.env.EMOTIONAL_VIOLATION))[0];
const motivationDecreaseQuestions = Array(JSON.parse(process.env.MOTIVATION_DECREASE))[0];
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/test.db', (err) => {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }
});

const updateResults = (ind, answer, results) => {
    results[0] += weights[ind][answer];
    results[1] += physicalDiscomfortQuestions.includes(ind + 1) ? weights[ind][answer] : 0;
    results[2] += cognitiveDiscomfortQuestions.includes(ind + 1) ? weights[ind][answer] : 0;
    results[3] += emotionalViolationQuestions.includes(ind + 1) ? weights[ind][answer] : 0;
    results[4] += motivationDecreaseQuestions.includes(ind + 1) ? weights[ind][answer] : 0;
};

const calculate = (answers) => {
    results = [0, 0, 0, 0, 0];
    for (let i = 0; i < answers.length; i++) {
        updateResults(i, answers[i], results);
    }
    
    return results;
};

const validate = async (answers) => {
    if (answers.length != 36) {
        return false;
    }
    return answers.every(answer => answer >= 0 && answer <= 2);
};

exports.save = async (answer, resp_id, quiz_id) => {
    return new Promise(async (resolve, reject) => {
        if (await validate(answer)) {
            const results = await calculate(answer);
            db.run('INSERT INTO result (resp_id, answer, distress, physical_discomfort, cognitive_discomfort, emotional_violation, motivation_decrease, quiz_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [resp_id, answer, results[0], results[1], results[2], results[3], results[4], quiz_id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        } else {
            reject("Invalid answer");
        }
    });
};