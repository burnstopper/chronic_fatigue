const Test = require('../models/test');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
require('dotenv').config({path: '../weights.env'});
const userMicroserviceHost = process.env.USER_MICROSERVICE_HOST;

exports.save = async (req, res) => {
    try {
        if (req.body.quiz_id != undefined) {
            const accessCheck = await axios.get(`${userMicroserviceHost}/members?respondent_id=${req.id}&quiz_id=${req.body.quiz_id}`);
            if (accessCheck.data.has_access == false) {
                res.status(403).send({error : 'You have no access to this quiz!'});
                return;
            }
        }

        const quiz_id = parseInt(req.body.quiz_id);

        if (req.body.quiz_id.length > 0 && isNaN(quiz_id)) {
            throw new Error("Invalid structure of test data!");
        }

        const result_id = await Test.save(req.body.answer, req.id, quiz_id);
        res.status(200).send({result_id : result_id});
    } catch (e) {
        res.status(400).send({error : e.message || e});
    }
};