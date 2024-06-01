const express = require("express");
const app = express();
const db = require('./db.js');
const PORT = process.env.URL_PORT || 8000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post("/identify", async function (req, res) {
    try{
        const { email, phoneNumber } = req.body;
        // if()

    } catch (error) {
		return res.status(500).json({ error: error.message });
	}

});

app.listen(PORT, function (error) {
    if (!error) {
        console.log("Server created Successfully on PORT :", PORT);
    } else {
        console.log("Error while starting server :", error)
    }
})

