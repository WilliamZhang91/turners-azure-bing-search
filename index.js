const express = require("express");
const request = require("request");
const bodyParser = require("body-Parser");
//const got = require("got")
var jsonParser = bodyParser.json();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require('dotenv').config()


app.use(express.static(__dirname))

app.post("/search", jsonParser, function (req, res) {
    const subscriptionKey = process.env.SUBSCRIPTIONKEY;
    const customConfigId = process.env.CUSTOMCONFIGID;
    const searchTerm = JSON.stringify(req.body.query)
    console.log(JSON.stringify(req.body.query));

    var info = {
        headers: {
            'Ocp-Apim-Subscription-Key': `${subscriptionKey}`
        },
        url: `https://api.bing.microsoft.com/v7.0/custom/search?q=${searchTerm}&customconfig=${customConfigId}&mkt=en-US`,
    }

    request(info, function (err, response, body) {
        var searchResponse = JSON.parse(body)
        console.log(searchResponse.webPages.value)
        if (err) {
            console.log(err, err.stack)
        } else {
            res.send(searchResponse.webPages.value.map((webpage) => {
                return (`<h3>${webpage.name}</h3>
                      <a href=${webpage.url}>${webpage.url}</a>
                      <p>${webpage.snippet}</p>`)
            }).join("")
            );
        };
    });
});



app.listen(4000)
