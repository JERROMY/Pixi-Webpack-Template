import { io } from "socket.io-client"

export class GameSocket{
    constructor( role, pObj, delegate, joinGameID ) {
        this.socket = io()
        this.clientID = ""
        this.gameID = ""
        this.role = role
        this.delegate = delegate
        this.pObj = pObj
        this.joinGameID = joinGameID

        if(role == 1){
            console.log("Join Game ID: " + joinGameID )
        }

        this.socket.on("connect", ()=>{
            console.log("============ info ===========")
            console.log( this.socket.id )
            // this.clientID = this.socket.id
            // console.log( "Client ID: " + this.clientID )
            // console.log( this.role )
            // console.log( this.socket )
            // console.log( this.clientID )
            // console.log( this.socket.id )
            // console.log( this.socket.connected )

            console.log("============ info ===========")

            this.socket.emit( 'regist', this.role )
            // socket.emit('regist client', 0);
            
        });
        

        this.socket.on("disconnect", ()=>{
    
        })

        this.socket.on("regist", (data)=>{
            if( data != "" ){
                const dataArr = data.split(",")
                const r = dataArr[ dataArr.length - 1 ]
                if( r == 0 ){
                    this.clientID = dataArr[0]
                    this.gameID = dataArr[0]
                    //console.log( this.socket )
                    console.log("Regist Game Success: " + this.gameID)


                    this.delegate.onCreatedGame( this.gameID,  this.pObj )


                }else if( r == 1 ){
                    this.clientID = dataArr[0]
                    this.fromID = dataArr[1]
                    //console.log( this.socket )
                    console.log("Regist Client Success: " + this.clientID)

                    this.socket.emit( 'join', this.joinGameID )
                }else{

                }
                
            }
            
            
        })

        this.socket.on("joined", (data)=>{
            if( data != "" ){
                
            }
            
            
        })

        console.log("Game Socket Start")

        //this.initSocket()

        

    }


    registNewGame(){

        this.socket.emit( 'regist', this.role )
    
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