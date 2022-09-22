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
        this.listNum = 0
        this.rank = 0

        if(role == 1){
            console.log("Join Game ID: " + joinGameID )
        }

        this.socket.on("connect", ()=>{
            console.log("============ info ===========")
            console.log( this.socket.id )

            const msg = this.role + "," + pObj.screenID
            
            // this.clientID = this.socket.id
            // console.log( "Client ID: " + this.clientID )
            // console.log( this.role )
            // console.log( this.socket )
            // console.log( this.clientID )
            // console.log( this.socket.id )
            // console.log( this.socket.connected )

            console.log("============ info ===========")

            this.socket.emit( 'regist', msg )
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
                    this.listNum = dataArr[ dataArr.length - 2 ]
                    //console.log( this.listNum )
                    //console.log( "Regist Game Success: " + this.gameID )


                    this.delegate.onCreatedGame( this.gameID,  this.listNum, this.pObj )


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
                const dataArr = data.split(",")
                const r = dataArr[ dataArr.length - 1 ]
                const a = dataArr[ dataArr.length - 2 ]
                this.gameID = dataArr[ dataArr.length - 3 ]

                console.log( this.gameID + " " + r + " " + a )

                if( a == 0 ){

                    if( r == 0 ){

                        //alert("There is no game match !")
                        //this.delegate.onReCreateGame( this.gameID,  this.pObj )
                        
                    }else if( r == 1 ){
                        
                        this.socket.disconnect()
                        alert("There is no game match !")

                    }else{
                        
                    }

                    
                }else if( a == 1 ){

                    if( r == 0 ){
                        console.log(" Detect Join ")
                        this.delegate.onJoinedGame( this.gameID,  this.pObj, r )
                    }else if( r == 1 ){
                        console.log(" User Join ")
                        this.delegate.onJoinedGame( this.gameID,  this.pObj, r )
                    }else{
                        
                    }

                }else{

                }
                

                
            }
        })

        this.socket.on("gone", (data)=>{

            //console.log( "gone" )
            if( data != "" ){
                const dataArr = data.split(",")
                const r = dataArr[ dataArr.length - 1 ]
                this.gameID = dataArr[ dataArr.length - 4 ]

                console.log( this.gameID + " " + r  )

                if( r == 0 ){

                    this.delegate.onReCreateGame( this.gameID,  this.pObj, r )
                    
                }else if( r == 1 ){
                    

                }else{
                    
                }
                

                
            }
        })

        this.socket.on("start-game", (data)=>{

            console.log( "Start Game" )

            if( data != "" ){
                const dataArr = data.split(",")
                const r = dataArr[ dataArr.length - 1 ]
                this.gameID = dataArr[ dataArr.length - 4 ]

                this.delegate.onStartGame( this.gameID,  this.pObj, r )
            
            }

        })

        this.socket.on("update-game", (data)=>{

            if( data != "" ){

                const dataArr = data.split(",")
                const xPosi = dataArr[0]
                const r = dataArr[1]
                // console.log( data )
                this.delegate.onUpdateGame( xPosi,  this.pObj, r )
            
            }

        })

        this.socket.on("update-status", (data)=>{

            if( data != "" ){

                const dataArr = data.split(",")
            
            }

        })

        this.socket.on("end-game", (data)=>{

            if( data != "" ){

                const dataArr = data.split(",")
                const score = dataArr[0]
                const listNum = dataArr[1]
                const rank = dataArr[2]
                const r = dataArr[3].toString()

                
                if(r == "1"){
                    this.socket.disconnect()
                }else{

                }

                this.delegate.onEndGame( score, listNum, rank, r, this.pObj )
                
                
            
            }

        })

        console.log("Game Socket Start")



        //this.initSocket()

        

    }

    startGame(){
        console.log( this.role )
        this.socket.emit( 'start-game', this.role )
    }

    endGame( score ){
        this.socket.emit( 'end-game', score )
    }


    registNewGame(){
        const msg = this.role + "," + this.pObj.screenID
        this.socket.emit( 'regist', msg )
    
    }

    updateGame( xPosi ){

        this.socket.emit( 'update-game', xPosi )
    
    }

    
}