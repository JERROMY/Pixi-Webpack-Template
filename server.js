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

class Game{
  constructor( gameID, clientID ){
    this.gameID = gameID
    this.hostID = clientID
    this.joinID = ""
  }
}

io.on('connection', (socket) => {

    console.log('a user connected: ' + socket.id)
  
    /*
  
    socket.on("disconnect", async () => {
    const sockets = await io.in(userId).fetchSockets();
      if (socket.length === 0) {
        // no more active connections for the given user
      }
    });
  
  
    */
  
    socket.on('disconnect', () => {
      console.log('user ' + socket.id + ' disconnected' + " Role:" + socket.data.role)
      const clientID = socket.id

      if( socket.data.role == 0 ){
        userJoinMap.delete( clientID )
        //console.log( userJoinMap )
      }

      let dataStr = socket.id + ","
      let msgStr = dataStr + '1'
      //sendDataTo(hostID, 'client_leave', msgStr);
    });
  
    socket.on('regist', (data) => {
      
            
      const role = data;
      let fromID = socket.id;
      let msgStr = ""
      socket.data.role = role

      if( role == 0 ){


        const dateTime = Date.now()
        const timestamp = Math.floor(dateTime).toString()

        const gameID = socket.id + "||" + timestamp
        const clientID = socket.id
        msgStr = gameID + "," + clientID + "," + fromID + "," + role
        

        const game = new Game( gameID, clientID )
        userJoinMap.set( clientID, game )

        //console.log( userJoinMap )
      
      //console.log('Game ID:' + gameID);
      }else if( role == 1 ){

        const clientID = socket.id;
        msgStr = clientID + "," + fromID + "," + role


      }else{

        msgStr = ""
      
      }
      
      
      sendDataTo(socket.id, 'regist', msgStr);

    });

    socket.on('join', (data) => {
            
      const joinGameID = data;
      const dataArr = joinGameID.split("||")
      const hoster = dataArr[0]
      let fromID = socket.id;
      let msgStr = fromID 

      if( userJoinMap.has( hoster ) ){

        const joinGame = userJoinMap.get( hoster )
        joinGame.joinID = fromID
        
        console.log( "Has Game: " + hoster )
        console.log( userJoinMap )
      
      }else{

        console.log( "Threre is no Game" )

      }


    
    })
  
    socket.on('send_to_all_clients', (data) => {
      hostID = socket.id
      let dataStr = data
      let fromID = socket.id
      let msgStr = fromID + "," + dataStr
      console.log('Host ID:' + socket.id)
      
      socket.broadcast.emit("get_msg_from_host", msgStr)
      sendToAllClients("get_msg_from_host", msgStr)
  
  
    })
  
    socket.on('regist_client', (data) => {
      console.log('Client ID:' + socket.id)
      let dataStr = data
      let msgStr = socket.id + "," + dataStr
      
      //io.sockets.emit("regist_client", msgStr)
      sendMsgTo(hostID, socket.id, 'regist_client', msgStr)
    });
  
    socket.on('send_to_host', (data) => {
      console.log('Send From Client ID:' + socket.id)
      //let fromID = socket.id;
      //let dataStr = fromID + ',' + data;
  
  
  
    });
  
    socket.on('chat_message', (msg) => {
      console.log('message: ' + msg)
      io.emit('chat message', msg)
    });
  
});

function sendToAllClients(event, data){
    let dataMsg = data
    io.broadcast(event, dataMsg)
  }
  
  function sendDataTo(userId, event, data){
    let dataMsg = data
    io.to(userId).emit(event, dataMsg)
  
  }

if (module === require.main) {
    const PORT = process.env.PORT || 8080
    server.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`)
      console.log('Press Ctrl+C to quit.')
    });
}

//Socket IO
  
module.exports = server