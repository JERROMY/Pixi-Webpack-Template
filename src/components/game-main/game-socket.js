import { io } from "socket.io-client"

export class GameSocket{
    constructor() {
        this.socket = io()
        this.clientID = ""

        this.socket.on("connect", ()=>{
            console.log("============ info 2 ===========")
            console.log( this.socket )
            console.log( this.socket.id )
            console.log( this.socket.connected )
            console.log("============ info 2 ===========")
            console.log( this.socket )
            console.log("============ info 2 ===========")
            //socket.emit('regist_host', "")
            
            // socket.emit('regist client', 0);
            
        });

        this.socket.on("disconnect", ()=>{
    
        })

        console.log("Game Socket Start")

        //this.initSocket()

        

    }

    

    initSocket(){
        this.socket.on("connect", ()=>{
            console.log("============ info ===========")
            // console.log(this)
            // console.log(this.id)
            // console.log(this.connected)
            console.log("============ info ===========")
    
            socket.emit('regist_host', "")
            
            // socket.emit('regist client', 0);
            
        });
        this.socket.on("disconnect", ()=>{
    
        })
    
        this.socket.on("client_leave", (data)=>{
            const dataArr = data.split(",");
            const leaveID = dataArr[0];
            console.log("Client Leave: " + leaveID)

        })
    
        this.socket.on("regist_host", (data)=>{
            const dataArr = data.split(",")
            this.clientID = dataArr[0]
            console.log("Regist Host Success: " + this.clientID)
            
        });
    
        this.socket.on("regist_client", (data)=>{
            const dataArr = data.split(",")
            const regClient = dataArr[0]
            console.log("Regist Client Success: " + regClient)
        });
    
        this.socket.on("data_from_client", (data)=>{
            const dataArr = data.split(",")
    
        })
    
    }
}