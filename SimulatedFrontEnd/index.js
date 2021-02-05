const express=require('express');
const serveStatic=require('serve-static');
const session = require('express-session');
const https = require('https');
const fs = require('fs');


var hostname="localhost";
var port=3001;


var app=express();


app.use(function(req,res,next){
    console.log(req.url);
    console.log(req.method);
    console.log(req.path);
    console.log(req.query.id);
    //Checking the incoming request type from the client
    if(req.method!="GET"){
        res.type('.html');
        var msg='<html><body>This server only serves web pages with GET request</body></html>';
        res.end(msg);
    }else{
        next();
    }
    session({
        secret: ['alllearnershavepotentialtobethebest'],
        name: "jwt",
        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: true, //carry the session on the same site
            maxAge: 1000*60*24  //session last for 24hrs before it times you out
        }
    });
});


app.use(serveStatic(__dirname+"/public"));


app.get("/", (req, res) => {
    res.sendFile("/public/home.html", { root: __dirname });
});


// app.listen(port,hostname,function(){

//     console.log(`Server hosted at http://${hostname}:${port}`);
// });

https.createServer({
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem'),
    passphrase: 'sweetie1'
}, app).listen(port, err => {
    if (err) return console.log(`Cannot Listen on PORT: ${port}`);
    console.log(`Server hosted at https://${hostname}:${port}`);
});