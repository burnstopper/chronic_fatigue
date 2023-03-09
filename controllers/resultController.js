const Result = require('../models/result');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
require('dotenv').config({path: '../weights.env'});
const userMicroserviceHost = process.env.USER_MICROSERVICE_HOST;

exports.findConcreteById = async (req, res) => {
    try {
        if (!req.query.test_id) {
            res.status(400).send({error : 'Missing test_id parameter'});
            return;
        }
        const result = await Result.findConcreteById(req.query.test_id);
        if (result == undefined) {
            res.status(404).send({error : 'Result not found'});
            return;
        }
        if (result.respondent_id != req.id) {
            const isResearcher = await axios.get(`${userMicroserviceHost}/user/check_researcher?token=${req.token}`);
            if (!isResearcher.data.is_researcher) {
                res.status(403).send({error : 'You are not authorized to access this resource'});
                return;
            } else {
                return res.send(result);
            }
        }
        res.status(200).send(result);
    } catch (e) {
        res.status(400).send({error : e.message});
    }
};

exports.findByTimestamp = async (req, res) => {
    try {
        if (!req.query.timestamp) {
            res.status(400).send({error : 'Missing timestamp parameter'});
            return;
        }
        const isResearcher = await axios.get(`${userMicroserviceHost}/user/check_researcher?token=${req.token}`);
        if (!isResearcher.data.is_researcher) {
            res.status(403).send({error : 'You are not authorized to access this resource'});
            return;
        }
        const result = await Result.findByTimestamp(req.query.timestamp);
        if (result == undefined) {
            res.status(404).send({error : 'Result not found'});
            return;
        }
        res.status(200).send(result);
    } catch (e) {
        res.status(400).send({error : e.message});
    }
};

exports.findAllByRespId = async (req, res) => {
    try {
        const result = await Result.findAllByRespId(req.id);
        if (result == undefined || result.length == 0) {
            res.status(404).send({error : 'Result not found'});
            return;
        }
        if (result[0].resp_id != req.id) {
            res.status(403).send({error : 'You are not authorized to access this resource'});
            return;
        }
        res.status(200).send(result);
    } catch (e) {
        res.status(400).send({error : e.message});
    }
};

/*exports.findAllByQuizId = async (req, res) => {
    try {
        const result = await Result.findAllByQuizId(req.params.id);
        res.status(200).send(result);
    } catch (e) {
        res.status(400).send({error : e.message});
    }
};*/