const express = require('express')

const app = express()
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const https = require('https');


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

// const keyPath = './localhost+2-key.pem';
// const certPath = './localhost+2.pem';

// const hskey = fs.readFileSync(keyPath);
// const hscert = fs.readFileSync(certPath);

// const server = https.createServer({
//   key: hskey,
//   cert: hscert
// }, app);


const http = require('http')
const server = http.createServer(app)


let totalGameNum = 4
let nowEndNum = 0
const hostID = '';
const userJoinMap = new Map()



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
    
  nowEndNum = 0
  userJoinMap.clear()

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


class Game{
  constructor( gameID, clientID ){
    this.gameID = gameID
    this.hostID = clientID
    this.joinID = ""
    this.score = 0
    this.rank = 0
    this.listNum = 0
  }
}

io.on('connection', (socket) => {

    // console.log('a user connected: ' + socket.id)
  
    /*
  
    socket.on("disconnect", async () => {
    const sockets = await io.in(userId).fetchSockets();
      if (socket.length === 0) {
        // no more active connections for the given user
      }
    });
  
  
    */
  
    socket.on('disconnect', () => {
      // console.log('user ' + socket.id + ' disconnected' + " Role:" + socket.data.role)
      const clientID = socket.id
      let msgStr = ""
      let role = 0

      if( socket.data.role == 0 ){
        userJoinMap.delete( clientID )
        //console.log( userJoinMap )
      }else if( socket.data.role == 1 ){
        
        if( socket.data.game ){
          
          const game = socket.data.game
          role = 0
          msgStr = game.gameID + "," + game.hostID + "," + game.joinID + "," + role 
          // console.log( msgStr )
          
          sendDataTo(game.hostID, 'gone', msgStr)

          game.joinID = ""
          socket.data.game = null
        }

        
        

        //console.log( userJoinMap )

      }else{

      }

      //let dataStr = socket.id + ","
      //let msgStr = dataStr + '1'
      //sendDataTo(hostID, 'client_leave', msgStr);
    });
  
    socket.on('regist', (data) => {
      
      let dataStr = data
      const dataArr = dataStr.split(",")
      const role = dataArr[0]
      const screenID = dataArr[1]
      let fromID = socket.id;
      let msgStr = ""
      socket.data.role = role

      

      if( role == 0 ){

        const dateTime = Date.now()
        const timestamp = Math.floor(dateTime).toString()

        const gameID = socket.id + "||" + timestamp
        const clientID = socket.id
        
        if( userJoinMap.has( clientID ) ){
          userJoinMap.delete( clientID )
        }
        
        
        const game = new Game( gameID, clientID )
        userJoinMap.set( clientID, game )

        // const gameNum = userJoinMap.size
        game.listNum = screenID

        msgStr = gameID + "," + clientID + "," + fromID + "," + game.listNum + "," + role


        // console.log( userJoinMap )
      
      //console.log('Game ID:' + gameID);
      }else if( role == 1 ){

        const clientID = socket.id;
        msgStr = clientID + "," + fromID + "," + role


      }else{

        msgStr = ""
      
      }
      
      
      sendDataTo(socket.id, 'regist', msgStr)

    });

    socket.on('join', (data) => {
            
      let joinGameID = data;
      const dataArr = joinGameID.split("||")
      const hoster = dataArr[0]
      let clientID = socket.id
      let fromID = socket.id;
      let msgStr = "" 

      if( userJoinMap.has( hoster ) ){

        const joinGame = userJoinMap.get( hoster )

        if( joinGame.gameID == joinGameID ){
          // console.log( "Has Game: " + hoster )
          //console.log( userJoinMap )
          
          joinGame.joinID = clientID

          let role = 0
          const act = 1
          msgStr = hoster + "," + fromID + "," + joinGameID + "," + joinGame.listNum + "," + act + "," + role
          
          socket.data.game = joinGame

          sendDataTo(hoster, 'joined', msgStr)

          role = 1
          msgStr = hoster + "," + fromID + "," + act + "," + role

          sendDataTo(fromID, 'joined', msgStr)
        
        }else{

          let role = 0
          const act = 0
          joinGameID = "none"
          msgStr = hoster + "," + fromID + "," + joinGameID + "," + act + "," + role

          
          console.log( "Threre is no Game" + " " + hoster)

          sendDataTo(hoster, 'joined', msgStr)

          role = 1
          msgStr = hoster + "," + fromID + "," + act + "," + role

          sendDataTo(fromID, 'joined', msgStr)

        }

        
        
      
      }else{

        
        let role = 0
        const act = 0
        joinGameID = "none"
        msgStr = hoster + "," + fromID + "," + joinGameID + "," + act + "," + role

        
        console.log( "Threre is no Game" + " " + hoster)

        sendDataTo(hoster, 'joined', msgStr)

        role = 1
        msgStr = hoster + "," + fromID + "," + act + "," + role

        sendDataTo(fromID, 'joined', msgStr)

      }


    
    })

    socket.on('start-game', (data) => {
      
      //console.log( socket.data.game )
      if( socket.data.game ){
        const game = socket.data.game
        let role = 0
        msgStr = game.gameID + "," + game.hostID + "," + game.joinID  + "," + role

        sendDataTo(game.hostID, 'start-game', msgStr)

        role = 1
        msgStr = game.gameID + "," + game.hostID + "," + game.joinID  + "," + role
        // console.log( "=====" )
        // console.log( game.joinID )
        sendDataTo(game.joinID, 'start-game', msgStr)
      
      }
    
    
    })

    socket.on('update-game', (data) => {
      
      //console.log( socket.data.game )
      if( socket.data.game ){
        const game = socket.data.game
        let role = 0
        const msgStr = data + "," + role

        sendDataTo(game.hostID, 'update-game', msgStr)

      
      }
    
    
    })

    socket.on('update-status', (data) => {
      
      //console.log( socket.data.game )
      
    
    
    })

    socket.on('end-game', (data) => {
      
      //console.log( socket.data.game )
      //console.log( "End Game Main" )
      const hoster = socket.id
      if( userJoinMap.has( hoster ) ){
        const game = userJoinMap.get( hoster )
        game.score = data

        

        nowEndNum += 1
        // console.log("End Game Num " + nowEndNum)
        checkNowEndNum()

        

      }

      
      
    
    
    })

    socket.on('time-event', (data) => {
      
      //console.log( socket.data.game )
      //console.log( "End Game Main" )
      const hoster = socket.id
      if( userJoinMap.has( hoster ) ){
        
        const game = userJoinMap.get( hoster )
        const eventName = data
        
        sendDataTo(game.joinID, "time-event", eventName)

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

function checkNowEndNum(){
  if(nowEndNum >= totalGameNum){

    nowEndNum = 0


    // console.log(" Final End " + nowEndNum)

    //const msgStr = game.score + "," + game.listNum + "," + game.rank + "," + 1
    //sendDataTo(game.joinID, 'end-game', msgStr)

    // console.log( userJoinMap )

    const rankGameMap = new Map([...userJoinMap.entries()].sort((a, b) => b[1].score - a[1].score));
    
    let msgStr = ""
    let totalNum = 0
    for (const [key, obj] of rankGameMap) {

      totalNum += 1
      const game = obj
      game.rank = totalNum

      // console.log( game.rank )

      msgStr = game.score + "," + game.listNum + "," + game.rank + "," + 0
      sendDataTo(game.hostID, 'end-game', msgStr)

      msgStr = game.score + "," + game.listNum + "," + game.rank + "," + 1
      sendDataTo(game.joinID, 'end-game', msgStr)
      

    }

    



  }

}

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