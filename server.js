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
const io = new Server( server )

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



//Socket IO
const hostID = '';
const userJoinMap = new Map()

io.on('connection', (socket) => {

    console.log('a user connected: ' + socket.id);
  
    /*
  
    socket.on("disconnect", async () => {
    const sockets = await io.in(userId).fetchSockets();
      if (socket.length === 0) {
        // no more active connections for the given user
      }
    });
  
  
    */
  
    socket.on('disconnect', () => {
      console.log('user ' + socket.id + ' disconnected');
      let dataStr = socket.id + ",";
      let msgStr = dataStr + '1';
      sendDataTo(hostID, 'client_leave', msgStr);
    });
  
    socket.on('regist_host', (data) => {
      hostID = socket.id;
      let dataStr = "";
      let fromID = socket.id;
      let msgStr = hostID + "," + dataStr;
      console.log('Host ID:' + socket.id);
      sendDataTo(socket.id, 'regist_host', msgStr);
    });
  
    socket.on('send_to_all_clients', (data) => {
      hostID = socket.id;
      let dataStr = data;
      let fromID = socket.id;
      let msgStr = fromID + "," + dataStr;
      console.log('Host ID:' + socket.id);
      
      socket.broadcast.emit("get_msg_from_host", msgStr);
      sendToAllClients("get_msg_from_host", msgStr);
  
  
    });
  
    socket.on('regist_client', (data) => {
      console.log('Client ID:' + socket.id);
      let dataStr = data;
      let msgStr = socket.id + "," + dataStr;
      
      //io.sockets.emit("regist_client", msgStr);
      sendMsgTo(hostID, socket.id, 'regist_client', msgStr);
    });
  
    socket.on('send_to_host', (data) => {
      console.log('Send From Client ID:' + socket.id);
      //let fromID = socket.id;
      //let dataStr = fromID + ',' + data;
  
  
  
    });
  
    socket.on('chat_message', (msg) => {
      console.log('message: ' + msg);
      io.emit('chat message', msg);
    });
  
});

function sendToAllClients(event, data){
    let dataMsg = data;
    io.broadcast(event, dataMsg);
  }
  
  function sendDataTo(userId, event, data){
  
    let dataMsg = data;
    io.to(userId).emit(event, dataMsg);
  
  }

if (module === require.main) {
    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
      console.log('Press Ctrl+C to quit.');
    });
}

//Socket IO
  
module.exports = server;