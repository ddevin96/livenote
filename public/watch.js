let peerConnection;
const config = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"]
    }
  ]
};
var socket;

function initclient(namespace)
{
  console.log("try connected socket: "+window.location.origin+"/"+namespace)
  socket = io.connect(window.location.origin+"/"+namespace, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: 99999
  });

  socket.on("offer", (id, description) => {
    
    peerConnection = new RTCPeerConnection(config);
    peerConnection
      .setRemoteDescription(description)
      .then(() => peerConnection.createAnswer())
      .then(sdp => peerConnection.setLocalDescription(sdp))
      .then(() => {
        socket.emit("answer", id, peerConnection.localDescription);
      });
    peerConnection.ontrack = event => {
      video.srcObject = event.streams[0];
    };
    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit("candidate", id, event.candidate);
      }
    };
  });
  
  socket.on("candidate", (id, candidate) => {
    peerConnection
      .addIceCandidate(new RTCIceCandidate(candidate))
      .catch(e => console.error(e));
  });
  
  socket.on("connect", () => {
    socket.emit("watcher");
    console.log("watcher");
  });
  
  socket.on("broadcaster", () => {
    socket.emit("watcher");
    console.log("watcher");
  });
  
  socket.on("disconnectPeer", () => {
    peerConnection.close();
  });

  socket.on( "event:start", function (msg) {
    s = JSON.parse(msg)
    console.log("Presentation start "+msg); 
  });
  socket.on( "event:slide", function (msg) {
    console.log("Presentation Change "+msg); 
    s = JSON.parse(msg)
    loadStatus(s);
  });
  socket.on( "event:slide:shape", function (msg) {
    console.log("NEW SHAPE BABY"); 
    s = JSON.parse(msg)
    loadShape(s)
  });

}

const video = document.querySelector("video");

window.onunload = window.onbeforeunload = () => {
  socket.close();
};
