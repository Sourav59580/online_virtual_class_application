const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {v4: uuidV4} = require('uuid')
const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server,{
    debug : true
})

//use of peerjs
app.use('/peerjs',peerServer)

//view engine set
app.set("view engine","ejs");

//static folder use
app.use(express.static("public"));

//route
app.get("/",(req,res)=>{
    res.render('index');
})

app.get("/join",(req,res)=>{
    res.redirect(`/${uuidV4()}`)
})

app.get("/:room",(req,res)=>{
    res.render('room',{ roomId: req.params.room })
})


// sockect.io
io.on('connection', socket =>{
    socket.on('join-room',(roomId,userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected',userId)

        //send msg same roomid
        socket.on('message',(msg)=>{
            io.to(roomId).emit('createMessage',msg);
        })

        // count participants
        // socket.on('countpeople',(person)=>{
        //     io.to(roomId).emit('participants',person);
        // })

        socket.on('disconnect',()=>{
            socket.to(roomId).broadcast.emit("user-disconnected",userId)
        })
    })
})








const PORT = process.env.PORT || 3000;
//server connection
server.listen(PORT,()=> console.log(`server is running at port ${PORT}`));

