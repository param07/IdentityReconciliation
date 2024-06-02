const express = require("express");
const app = express();
const db = require('./db.js');
const PORT = process.env.URL_PORT || 8000;
const bodyParser = require('body-parser');
const cors = require('cors');


app.use(cors());
app.use(bodyParser.json());

async function insertNewContact(email, phoneNumber, queryParams, client, primeId, linkPrecedence){
    let insertQuery = 'insert into Contact (';
    if(email){
        insertQuery += 'email, ';
    }
    if(phoneNumber){
        insertQuery += 'phonenumber, ';
    }
    if(primeId != 0){
        insertQuery += 'linkeid, ';
        queryParams.push(primeId);
    }
    insertQuery += 'linkprecedence) values (';
    let count = 1;
    for (let i = 0; i < queryParams.length; i++){
        insertQuery += `$${count}, `;
        count += 1;
    }
    insertQuery += `$${count}) returning *`;
    queryParams.push(linkPrecedence);
    return await client.query(insertQuery, queryParams);
}

app.post("/identify", async function (req, res) {
    let client;
    let contact = {}
    try{
        const { email, phoneNumber } = req.body;
        if(!email && !phoneNumber){
            return res.status(400).json({error: 'Email or phone number is required'});
        }
        let query = 'select * from Contact where';
        let queryParams = [];

        if(email){
            queryParams.push(email);
            query += ` email = $${queryParams.length}`;
        }

        if(phoneNumber){
            if(queryParams.length > 0){
                query += ' or'
            }
            queryParams.push(phoneNumber);
            query += ` phonenumber = $${queryParams.length}`;
        }
        query += ' order by createdat ASC';
        client = await db.pool.connect();

        const contactCurr = await client.query(query, queryParams);
        if(contactCurr && contactCurr.rowCount > 0){
            console.log(contactCurr.rows);
            if((((email && (email === contactCurr.rows[0].email)) && (phoneNumber && phoneNumber != contactCurr.rows[0].phonenumber)) || (((phoneNumber && (phoneNumber === contactCurr.rows[0].phonenumber)) && (email && email != contactCurr.rows[0].email))) || ((email && phoneNumber) && ((contactCurr.rows[0].email && !contactCurr.rows[0].phonenumber) || (contactCurr.rows[0].phonenumber && !contactCurr.rows[0].email))))){
                const insertContact = insertNewContact(email, phoneNumber, queryParams, client, contactCurr.rows[0].id, "secondary");
            }
            
            // let phoneNums = [];
            // let emailAll = [];
            // let secondaryContacts = [];
            // for (let i = 0; i < insertContact.rowCount; i++) {
            //     if(i === 0){
            //         contact["primaryContatctId"] = insertContact.rows[i].id;
            //     } else {
            //         secondaryContacts.push(insertContact.rows[i].id);
            //     }
            //     phoneNums.push(insertContact.rows[i].phonenumber);
            //     emailAll.push(insertContact.rows[i].email);
            // }
            // contact["emails"] = emailAll;
            // contact["phoneNumbers"] = phoneNums;
            // contact["secondaryContactIds"] = secondaryContacts;

        } else {
            const insertContact = insertNewContact(email, phoneNumber, queryParams, client, 0, "primary");
            if(insertContact && insertContact.rowCount > 0){
                console.log(insertContact.rows[0]);
                contact["primaryContatctId"] = insertContact.rows[0].id;
                contact["emails"] = [insertContact.rows[0].email];
                contact["phoneNumbers"] = [insertContact.rows[0].phonenumber];
                contact["secondaryContactIds"] = [];
            }

        }
        return res.status(200).json({ contact });

    } catch (error) {
		return res.status(500).json({ error: error.message });
	} finally {
        if (client) {
            client.release();
        }
    }

});

app.listen(PORT, function (error) {
    if (!error) {
        console.log("Server created Successfully on PORT :", PORT);
    } else {
        console.log("Error while starting server :", error)
    }
});

