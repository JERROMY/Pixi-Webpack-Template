const express = require('express')
const app = express()
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http')
const server = http.createServer(app)

/*
    // const https = require('https');
    const server = https.createServer({
        key: hskey,
        cert: hscert
    }, app);

    const keyPath = './localhost+5-key.pem';
    const certPath = './localhost+5.pem';

    const hskey = fs.readFileSync(keyPath);
    const hscert = fs.readFileSync(certPath);

*/

// const srcPath = path.join(__dirname, '/dist');
const srcPath = path.resolve( __dirname, './dist' )


const { Server } = require("socket.io")
const io = new Server(server)

app.use(bodyParser.text({type: '*/*'}))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use( '/static', express.static( srcPath ) );
//app.use( '/', express.static( srcPath ) );

app.get("/",function(req, res){
    
    const pathToHtmlFile = path.resolve( srcPath, 'index.html' )
    const contentFromHtmlFile = fs.readFileSync( pathToHtmlFile, 'utf-8' )

    res.send( contentFromHtmlFile )
    //res.sendFile(srcPath + '/index.html')
});

app.get("/m/",function(req,res){
    
    const pathToHtmlFile = path.resolve( srcPath, 'index-mobile.html' )
    console.log( pathToHtmlFile )
    const contentFromHtmlFile = fs.readFileSync( pathToHtmlFile, 'utf-8' )

    res.send( contentFromHtmlFile )

});

if (module === require.main) {
    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
      console.log('Press Ctrl+C to quit.');
    });
  }
  
  module.exports = server;