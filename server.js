const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {v4: uuidV4} = require('uuid')

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

        socket.on('disconnect',()=>{
            socket.to(roomId).broadcast.emit("user-disconnected",userId)
        })
    })
})








const PORT = process.env.PORT || 3000;
//server connection
server.listen(PORT,()=> console.log(`server is running at port ${PORT}`));

