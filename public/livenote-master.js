/*CHAT */
var nickname = '';
function showChat(){
  if(nickname == ''){
    document.getElementById('dialog-nickname').showModal();
      $('#enter').click( function()
        { 
          //TODO check the lenght of nickname greater then 0
          nickname =  $('#input-nickname').val();
          if(nickname.length != 0){
            socket.emit("chat-enter", nickname);
           // socket.emit("chat-ask-list");
            hide =$('#chat').is(':hidden')
            if(!hide){
              $("#chat_input").val('');
              $('#chat').hide();
            }else {
              $('#chat').show();
              $("#chat_input").focus();
              $("#chat_input").val('');
              scrollChatList();
            }
          }else {
            document.getElementById('dialog-error-nickname').showModal();
          }
        }
      );
  }else{
    hide =$('#chat').is(':hidden')
    if(!hide){
      $("#chat_input").val('');
      $('#chat').hide();
    }else {
      $('#chat').show();
      $("#chat_input").focus();
      $("#chat_input").val('');
      scrollChatList();
    }
  }
}
function scrollChatList(){
  var wtf    = $('#chat-list');
    var height = wtf[0].scrollHeight;
    wtf.scrollTop(height);
}
function addNewMessage(name, message){
   if($('#chat-list').children().length == 0){
      sside = '-right'
      side = 'from-right toright'
   }else{
      sside = $('#chat-list').children('.message').last().hasClass("-right")? '-left':'-right';
      side = sside == '-left'? 'from-left toleft':'from-right toright';
   }
   ptext = $('<p>', {
    text: name + ": "+ message
   });
   div = $('<div>', {
    class: 'nes-balloon '
   });
   ptext.appendTo(div);
   section = $('<section>', {
    class: 'message '
   }).appendTo('#chat-list');
   div.appendTo(section);
   scrollChatList();
}
function initServices(mysocket){

  $(document).keydown(function(e){
   
    if(e.ctrlKey && e.altKey && e.keyCode == 67){
      showChat();
       //CTRL + ALT + t keydown combo
    }else if(e.ctrlKey && e.altKey && e.keyCode == 80){
      makepokemon();
       //CTRL + ALT + p keydown combo
    }else if(e.ctrlKey && e.altKey && e.keyCode == 77){
      hidecontrol();
       //CTRL + ALT + m keydown combo
    } else if(e.ctrlKey && e.altKey && e.keyCode == 65){
      changepokemon();
       //CTRL + ALT + A keydown combo
    }
  });
 
  socket.on("chat-list", (list) => {
    if(list == undefined) return;
    $("#ul-users").empty();
    for (var k in list) {
      $("#ul-users").append('<li>'+list[k]+'</li>');
    }
    $("#nusers").text(Object.keys(list).length)
  });
  socket.on("chat-message", (name, message) => {
    addNewMessage(name, message);
  });
  $(document).keyup(function(event) {
    if ($("#chat_input").is(":focus") && event.key == "Enter") {
      message = $("#chat_input").val()
      socket.emit("chat-message", nickname, message);
      $("#chat_input").val('');
      addNewMessage(nickname, message);
    }
  });
}

/*END CHAT */

function hidecontrol(){
  $(".control").each(function (index, element) {
    hide = $(element).is(':hidden');
    if(!hide){
      $(element).hide()     
    }else {
      $(element).show()
    }
});
}
var pokemons =  [
  "nes-mario",
  "nes-ash",
  "nes-pokeball",
  "nes-bulbasaur",
  "nes-charmander",
  "nes-squirtle",
  "nes-kirby"]

var mypokemon = 4;

function makepokemon(){
  if(pmode == 0)
  {
    hide =$('#video-balloon').is(':hidden')
    if(!hide){
      updatepokemon(true, pokemons[mypokemon]);
      socket.emit("pokemon",true, pokemons[mypokemon]);
    
    }else {
      updatepokemon(false, pokemons[mypokemon]);
      socket.emit("pokemon",false, pokemons[mypokemon]);
    }
  }
}
function updatepokemon(status, name){
  if(status){
    $('#video-balloon').hide();
    $('#video-avatar').hide();
    $('#pokemon').removeClass();
    $('#pokemon').addClass(name);
    $('#pokemon').show();
  }else {
    $('#video-balloon').show();
    $('#video-avatar').show();
    $('#pokemon').hide()
  }
}
function changepokemon(){
  hide = $('#video-balloon').is(':hidden')
  mypokemon = (mypokemon + 1) % pokemons.length;
  if(pmode == 0 && hide)
  {
    socket.emit("pokemon", true, pokemons[mypokemon]);
    updatepokemon(true, pokemons[mypokemon]);
  }
}

function initThis(mode, path, slide) {

    
    pmode = mode;
    if (mode == 1) {
      socket.on( "slidechanged", function (msg) {
        console.log("Presentation Change "+msg); 
        s = JSON.parse(msg)
        loadStatus(s);
      });
      socket.on( "pokemon", function (status, name) {
        updatepokemon(status,name)
      });
  }

    document.querySelector('#pdf-render').addEventListener('touchstart', function(e){
      console.log("starting touch")
      touchPressed = true;
      var x =  e.pageX - $(this).offset().left
      var y =  e.pageY - $(this).offset().top
      Draw(x, y, false);
    });

    document.querySelector('#pdf-render').addEventListener('touchmove', function(e){
      console.log("moving touch here")
      if (touchPressed) {
        var x =  e.pageX - $(this).offset().left
        var y =  e.pageY - $(this).offset().top
        Draw(x, y, true);
        shape['data'].push({"x":x, "y":y});
      }
    });

    document.querySelector('#pdf-render').addEventListener('touchend', function(e){
      console.log("ending touch here")
      touchPressed = false;
     
      shape = {"data":[], "width":$(window).width() , "height": $(window).height()}
    });

    document.querySelector('#pdf-render').addEventListener('touchcancel', function(e){
      console.log("cancelling touch here")
      touchPressed = false;
    
      shape = {"data":[], "width":$(window).width() , "height": $(window).height()}
    });

    $('#pdf-render').mousedown(function (e) {
      mousePressed = true;
      var x =  e.pageX - $(this).offset().left
      var y =  e.pageY - $(this).offset().top
      Draw(x, y, false);
    });

    $('#pdf-render').mousemove(function (e) {
      if (mousePressed) {
        var x =  e.pageX - $(this).offset().left
        var y =  e.pageY - $(this).offset().top
        Draw(x, y, true);
        shape['data'].push({"x":x, "y":y});
      }
    });

    $('#pdf-render').mouseup(function (e) {
        mousePressed = false;
    
        shape = {"data":[], "width":$(window).width() , "height": $(window).height()}
    });
    $('#pdf-render').mouseleave(function (e) {
        mousePressed = false;
       
        shape = {"data":[], "width":$(window).width() , "height": $(window).height()}
    });

    var shape = {"data":[], "width":$(window).width() , "height": $(window).height()}
    // Get Document

    pdfjsLib
    .getDocument(path)
    .promise.then(pdfDoc_ => {
      pdfDoc = pdfDoc_;

      document.getElementById("progress-bar").setAttribute("max", pdfDoc.numPages);
      renderPage(slide);
      $('#info').click( function()
      {
        document.getElementById('dialog-info').showModal();
      });
    })
    .catch(err => {
      // Display error
      const div = document.createElement('div');
      div.className = 'error';
      div.appendChild(document.createTextNode(err.message));
      document.querySelector('body').insertBefore(div, canvas);
      // Remove top bar
      document.querySelector('.top-bar').style.display = 'none';
    });

}




let pdfDoc = null,
pageNum = 1,
pageIsRendering = false,
pageNumIsPending = null;

const scale = 2,
canvas = document.querySelector('#pdf-render'),
ctx = canvas.getContext('2d');

function resize(){
  renderPage(pageNum);
}
// Render the page
const renderPage = num => {
  pageIsRendering = true;

  // Get page
  pdfDoc.getPage(num).then(page => {

    var viewport = page.getViewport({ scale: 1, });
    console.log(viewport.width +" "+viewport.height+" "+scale)
    var scale = Math.min((window.innerHeight / viewport.height), (window.innerWidth / viewport.width));
    
    var viewport = page.getViewport({scale: scale,});
   
     canvas.height = window.innerHeight;
    canvas.width = viewport.width; 
   // canvas.height =  page.getViewport({ scale: 1, }).height;
   // canvas.width = page.getViewport({ scale: 1, }).width;
    
 
   var viewport = page.getViewport({ scale: 1, });
   if(viewport.width > viewport.height){
    var d =  window.innerWidth;
    var scale = d / viewport.width;
    var viewport = page.getViewport({ scale: scale, });
    canvas.height = viewport.height;
    canvas.width = window.innerWidth; 
 
   }else{
      var d =  window.innerHeight;
      var scale = d / viewport.height;
      var viewport = page.getViewport({ scale: scale, });
      canvas.height = window.innerHeight;
      canvas.width = viewport.width; 
   }
   

        const renderCtx = {
          canvasContext: ctx,
          viewport
        };

        page.render(renderCtx).promise.then(() => {
          pageIsRendering = false;

          if (pageNumIsPending !== null) {
            renderPage(pageNumIsPending);
            pageNumIsPending = null;
          }
        });

        // Output current page
       
      });
    };

  // Check for pages rendering
  const queueRenderPage = num => {
    if (pageIsRendering) {
      pageNumIsPending = num;
    } else {
      renderPage(num);
    }
  };

// Show Prev Page
const showPrevPage = () => {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  (pmode == 0) && sendMasterStatus(pageNum);
  queueRenderPage(pageNum);
  document.getElementById("progress-bar").setAttribute("value", pageNum);
};

// Show Next Page
const showNextPage = () => {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  (pmode == 0) && sendMasterStatus(pageNum);
  queueRenderPage(pageNum);
  document.getElementById("progress-bar").setAttribute("value", pageNum);

};
function sendMasterStatus(pageNum){
  status.nslide = pageNum;
  console.log(socket);
  socket.emit("master", JSON.stringify(status), function (data) {      
    console.log('Message next page sent! '+ status.nslide);
  }); 
 
}
// Go FullScreen when clicked on the button
const goFullScreen = () => {
  //document.getElementsByTagName("body")[0].requestFullscreen();
  var elem = document.getElementsByTagName("body")[0];

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
  $('#full-screen').hide()
};

// Listener on going full screen
document.addEventListener('fullscreenchange', closeFullScreen, false);
document.addEventListener('mozfullscreenchange', closeFullScreen, false);
document.addEventListener('MSFullscreenChange', closeFullScreen, false);
document.addEventListener('webkitfullscreenchange', closeFullScreen, false);

// Close full screen
function closeFullScreen () {
  var elem = document.getElementById("full-screen")

  if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement){
    hide = $(elem).is(':hidden');
    if(hide)
      $(elem).show()
  }
}

//switch page with arrow keys
document.onkeydown = function(e) {
  switch (e.keyCode) {
    //left arrow
    case 37:
      showPrevPage();
      break;
    //up arrow
    case 38:
      break;
    //right arrow
    case 39:
      showNextPage();
      break;
    //down arrow
    case 40:
      break;
  }
}

// Button Events
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);
document.querySelector('#full-screen').addEventListener('click', goFullScreen);


var mousePressed = false;
var touchPressed = false;
var lastX, lastY;
var socket = undefined;
var pID = window.location.pathname.split('/')[1];
let status = { "nslide":1 };  
let pmode = -1;

function loadStatus(s){
  status = s
  queueRenderPage(s.nslide);
}
function loadShape(s){
  nwidth = $(window).width()
  nheight = $(window).height()
  if (s.data.length == 0) return 
  lastX = (s.data[0].x * nwidth) / s.width;
  lastY = (s.data[0].y * nheight) / s.height;
  for (point in s.data) {
    ctx.beginPath();
    ctx.strokeStyle = $('#selColor').val();
    ctx.lineWidth = $('#selWidth').val();
    ctx.lineJoin = "round";
    ctx.moveTo(lastX, lastY);
    x = (s.data[point].x * nwidth) / s.width;
    y = (s.data[point].y * nheight) / s.height;
    ctx.lineTo(x,y);
    ctx.closePath();
    ctx.stroke();
    lastX = x;
    lastY = y;
    console.log(nwidth+ " "+nheight+" "+s.width+" "+s.height)
  }
}
function Draw(x, y, isDown) {
      if (isDown) {
          ctx.beginPath();
          ctx.strokeStyle = $('#selColor').val();
          ctx.lineWidth = $('#selWidth').val();
          ctx.lineJoin = "round";
          ctx.moveTo(lastX, lastY);
          ctx.lineTo(x, y);
          ctx.closePath();
          ctx.stroke();
      }
      lastX = x; lastY = y;
}
    
function clearArea() {
      // Use the identity matrix while clearing the canvas
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}


/*AUDIO VIDEO */

const peerConnections = {};
const config = {
  iceServers: [
    {
      urls: [
      "stun:isiswork01.di.unisa.it"]
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
  console.log("Connect to "+window.location.origin+namespace)
  socket = io.connect(window.location.origin+namespace, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: 99999
  });

  socket.on("answer", (id, description) => {
    peerConnections[id].setRemoteDescription(description);
  });
  
  socket.on("watcher", id => {
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
  
    $('#startlive').click( function()
    {
      startLive();
    });
    
    function handleError(error) {
      console.error("Error: ", error);
    }

    function startLive(){
      document.getElementById('dialog-play').showModal();
          $('#play').click( function()
            { 
              getStream()
              .then(getDevices)
              .then(gotDevices);
              function getDevices() {
                $('#startlive').removeClass("nes-logo");
                $('#liveperson').show();
                $('#select-audio').show();
                $('#select-video').show();
               
               // $('#startlive').addClass("nes-mario");
                return navigator.mediaDevices.enumerateDevices();
              }
            }
          );
    }
    $(document).keydown(function(e){
      if(e.ctrlKey && e.altKey && e.keyCode == 76){
        startLive();
         //CTRL + ALT + l keydown combo
      }
    });
    initServices(socket);
}


