
const http = require('http')
const server = http.createServer()
const { Server } = require("socket.io")
const io = new Server(server)

//Socket IO

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
    
    //sendToAllClients("get_msg_from_host", msgStr);


  });

  socket.on('regist_client', (data) => {
    console.log('Client ID:' + socket.id);
    let dataStr = data;
    let msgStr = socket.id + "," + dataStr;
    
    io.sockets.emit("regist_client", msgStr);
    // sendMsgTo(hostID, socket.id, 'regist_client', msgStr);
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

server.listen(3000)

  //Socket IO
module.exports = {
  //sockets,
  server,
  io
}