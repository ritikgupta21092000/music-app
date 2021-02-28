require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const AWS = require("aws-sdk");
const config = require("./config");

const users = require("./routes/users");


var PORT = 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use("/", users);

app.get('/', function (req, res) {
    res.render('index')
})

app.get("/users", (req, res) => {
    AWS.config.update(config.aws_remote_config);
    const doClient = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: "users"
    };

    doClient.scan(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});