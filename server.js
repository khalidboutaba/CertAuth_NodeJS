const express = require ('express');
const fs = require('fs');
const path = require('path');
const https = require('https');

const ops = {
    key: fs.readFileSync(path.resolve(__dirname, './Certs/ServerCerts/server_key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, './Certs/ServerCerts/server_cert.pem')),
    requestCert: true,
    rejectUnauthorized: false,
    ca: [ fs.readFileSync(path.resolve(__dirname, './Certs/ServerCerts/server_cert.pem'))]
    };
    
const app = express();

app.get('/', (req, res) => {
    res.send('<a href= "authenticate"> Log in using certificate</a>')
});

app.get('/authenticate', (req, res) => {
    const cert = req.socket.getPeerCertificate();
    if (req.client.authorized) {
        res.send(`Hello ${cert.subject.CN}, your certificate was issued by ${cert.issuer.CN}!`)
    } 
    else if (cert.subject) {
        res.status(403)
            .send(`Sorry ${cert.subject.CN}, certificates from ${cert.issuer.CN} are not welcome here.`)
    } else {
        res.status(401)
           .send(`Sorry, but you need to provide a client certificate to continue.`)
    }
})

https.createServer(ops, app).listen(8080);

console.log("App Started ...");