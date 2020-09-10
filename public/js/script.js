const socket = io('/')
const myPeer = new Peer(undefined,{
    host : '/',
    port : '443'
})

// select video grid container
const videoGrid = document.getElementById("video-grid");

let myVideoStream;
let ownVideoStream;
//create a video 
const myvideo = document.createElement("VIDEO");
myvideo.muted = true;

//count person
var person = 1;

// total present in video chat
const peers = {}

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream =>{
    myVideoStream = stream;
    ownVideoStream = stream
    addVideoStream(myvideo,ownVideoStream)

    myPeer.on('call',call =>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream',userVideoStream =>{
            addVideoStream(video,userVideoStream) 
        })
    })

    socket.on('user-connected',userId=>{
        console.log("User connected "+userId)
        connectToNewUser(userId,stream);
    })

    // disconnect end call user
    socket.on('user-disconnected', userId => {
        if (peers[userId]) peers[userId].close()
      })
})

// other new user video setup
function connectToNewUser(userId,stream){
    const call = myPeer.call(userId,stream)
    const video = document.createElement("video")
    call.on('stream',userVideoStream =>{
        addVideoStream(video,userVideoStream)
    })
    call.on('close',()=>{
        video.remove();
    })
    peers[userId] = call
}


// own video setup
function addVideoStream(video,stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    videoGrid.append(video);
  }


myPeer.on('open',id =>{
    socket.emit('join-room',roomId,id)
})


// muteUnmute
function muteUnmute(){
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        $(".audio").removeClass('d-none');
    }else{
        myVideoStream.getAudioTracks()[0].enabled = true;
        $(".audio").addClass('d-none');
    }
}

//play stop video
function playStop() {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        $(".video").removeClass('d-none');
    }else{
        myVideoStream.getVideoTracks()[0].enabled = true;
        $(".video").addClass('d-none');
    }
}

// share screen
function shareScreen(){
   
    navigator.mediaDevices.getDisplayMedia({
        video:true,
        audio:true
    }).then(stream =>{
       ownVideoStream = stream;
       addVideoStream(myvideo,ownVideoStream)

       myPeer.on('call',call =>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream',userVideoStream =>{
            addVideoStream(video,userVideoStream) 
        })
    })

    socket.on('user-connected',userId=>{
        console.log("User connected "+userId)
        connectToNewUser(userId,stream);
    })

    // disconnect end call user
    socket.on('user-disconnected', userId => {
        if (peers[userId]) peers[userId].close()
        person -=1;
        console.log(person);
        $(".participants").html(person);
      })
    })
   
}

