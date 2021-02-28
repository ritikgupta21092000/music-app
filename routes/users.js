const express = require("express");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const md5 = require("md5");
const config = require("../config");

const router = express.Router();

router.use(express.json());

router.post("/register", (req, res) => {
    AWS.config.update(config.aws_remote_config);
    const doClient = new AWS.DynamoDB.DocumentClient();
    console.log({ ...req.body });
    const Item = {};
    Item.uid = uuidv4();
    Item.fullName = req.body.fullName;
    Item.username = req.body.username;
    Item.password = md5(req.body.password);
    var params = {
        TableName: "users",
        Item: Item
    };

    doClient.put(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            res.send({ registered: true });
        }
    });
});

router.post("/login", (req, res) => {
    var { username, password } = req.body;
    AWS.config.update(config.aws_remote_config);
    const doClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: "users",
        Key: {
            "username": username
        }
    };
    doClient.get(params, (err, data) => {
        if (err) {
            console.log(err);
            res.send({ err: err });
        } else {
            if (data.Item.password === md5(password)) {
                console.log("Data: ", data);
                res.send({ login: true, userData: data.Item });
            } else {
                console.log("Invalid Username or Password");
                res.send({ message: "Invalid Username or Password" });
            }

        }
    })
});

module.exports = router;