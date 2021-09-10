const express = require("express") ; 
//const server = express() ; 

const app = require('express' )() ;
const http = require('http').Server(app) ;
const io = require('socket.io')(http) ;


app.use(express.static("public")) ; 

io.on('connection' , (socket)=>{
    console.log(socket.id) ;
})
//127.0.0.1 - local host

http.listen(3000 , function() {
    console.log('listening on *:3000' ) ; 
})
// server.listen(3000 , function(){
//     console.log("server is running at 3000" ) ; 
// })