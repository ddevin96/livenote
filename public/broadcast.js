const peerConnections = {};
const config = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302",
      "stun:stun1.l.google.com:19302",
      "stun:stun2.l.google.com:19302",
      "stun:stun3.l.google.com:19302",
      "stun:stun4.l.google.com:19302"]
    }
  ]
};
window.onunload = window.onbeforeunload = () => {
  console.log("Close socket")
  socket.close();
};


if (document.getElementById("video") != undefined )
document.getElementById("video").addEventListener('click', function(event){
//<img src="https://img.icons8.com/color/48/000000/record.png"/>  
//<img src="https://img.icons8.com/color/48/000000/stop.png"/>   
});
if (document.getElementById("audio") != undefined )
document.getElementById("audio").addEventListener('click', function(event){
//https://img.icons8.com/color/48/000000/play-record.png
//<img src="https://img.icons8.com/color/48/000000/block-microphone.png"/>  
});


var socket;

function initmaster(namespace){

  socket = io.connect(window.location.origin+"/"+namespace, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: 99999
  });

  socket.on("answer", (id, description) => {
    peerConnections[id].setRemoteDescription(description);
  });
  
  socket.on("watcher", id => {
    console.log("vai bello");
    const peerConnection = new RTCPeerConnection(config);
    peerConnections[id] = peerConnection;
  
    let stream = videoElement.srcObject;
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
  
    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit("candidate", id, event.candidate);
      }
    };
  
    peerConnection
      .createOffer()
      .then(sdp => peerConnection.setLocalDescription(sdp))
      .then(() => {
        socket.emit("offer", id, peerConnection.localDescription);
      });
  });
  
  socket.on("candidate", (id, candidate) => {
    peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
  });
  
  socket.on("disconnectPeer", id => {
    peerConnections[id].close();
    delete peerConnections[id];
  });

    // Get camera and microphone
  const videoElement = document.querySelector("video");
  const audioSelect = document.querySelector("select#audioSource");
  const videoSelect = document.querySelector("select#videoSource");

  audioSelect.onchange = getStream;
  videoSelect.onchange = getStream;

  getStream()
    .then(getDevices)
    .then(gotDevices);
    function getDevices() {
      return navigator.mediaDevices.enumerateDevices();
    }
    
    function gotDevices(deviceInfos) {
      window.deviceInfos = deviceInfos;
      for (const deviceInfo of deviceInfos) {
        const option = document.createElement("option");
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === "audioinput") {
          option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
          audioSelect.appendChild(option);
        } else if (deviceInfo.kind === "videoinput") {
          option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
          videoSelect.appendChild(option);
        }
      }
    }
    
    function getStream() {
      if (window.stream) {
        window.stream.getTracks().forEach(track => {
          track.stop();
        });
      }
      const audioSource = audioSelect.value;
      const videoSource = videoSelect.value;
      const constraints = {
        audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
        video: { deviceId: videoSource ? { exact: videoSource } : undefined }
      };
      return navigator.mediaDevices
        .getUserMedia(constraints)
        .then(gotStream)
        .catch(handleError);
    }
    
    function gotStream(stream) {
      window.stream = stream;
      audioSelect.selectedIndex = [...audioSelect.options].findIndex(
        option => option.text === stream.getAudioTracks()[0].label
      );
      videoSelect.selectedIndex = [...videoSelect.options].findIndex(
        option => option.text === stream.getVideoTracks()[0].label
      );
      videoElement.srcObject = stream;
      socket.emit("broadcaster");
    }
    
    function handleError(error) {
      console.error("Error: ", error);
    }
}
