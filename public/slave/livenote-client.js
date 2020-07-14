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
       //CTRL + ALT + T keydown combo
    }else if(e.ctrlKey && e.altKey && e.keyCode == 80){
      makepokemon();
       //CTRL + ALT + P keydown combo
    }else if(e.ctrlKey && e.altKey && e.keyCode == 77){
      hidecontrol();
       //CTRL + ALT + M keydown combo
    } else if(e.ctrlKey && e.altKey && e.keyCode == 65){
      changepokemon();
       //CTRL + ALT + A keydown combo
    }else if(e.ctrlKey && e.altKey && e.keyCode == 80){
      start();
       //CTRL + ALT + P keydown combo
    }
  })

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
    $('#info').click( function()
    {
      document.getElementById('dialog-info').showModal();
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
      var scale = Math.min((window.innerHeight / viewport.height), (window.innerWidth / viewport.width));
      console.log(window.innerHeight +" "+viewport.width+" "+scale)
      var viewport = page.getViewport({scale: scale,});
     
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
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

// Go FullScreen when clicked on the button
const goFullScreen = () => {
  //document.getElementsByTagName("body")[0].requestFullscreen();
  var elem = document.getElementsByTagName("body")[0];

  if ( $('#full-screen').text()=="Close"){
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
      document.msExitFullscreen();
    }
    return;
  }

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
  $('#full-screen').text("Close")
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

// Button Events
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
  pageNum = s.nslide
  document.getElementById("progress-bar").setAttribute("value", s.nslide);
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
let peerConnection;
const config = {
  iceServers: [
    {
      urls: [
      "stun:isiswork01.di.unisa.it"]
    }
  ]
};

var socket;
function initclient(namespace)
{
  socket = io.connect(window.location.origin+namespace, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: 99999
  });
  socket.on( "slidechanged", function (msg) {
    console.log("Presentation Change "+msg); 
    s = JSON.parse(msg)
    loadStatus(s);
  });
  socket.on( "pokemon-update", function (status, name) {
    updatepokemon(status,name)
  });  
  //TODO BUG quando un client si collega se il video è in modalità pokemon può vederlo, lo stesso, quando si collega deve chiedere il permesso del video


  socket.on("offer", (id, description) => {
    console.log(id)
    console.log(description)
    
    peerConnection = new RTCPeerConnection(config);
    peerConnection
      .setRemoteDescription(description)
      .then(() => peerConnection.createAnswer())
      .then(sdp => peerConnection.setLocalDescription(sdp))
      .then(() => {
        $('#liveperson').show();
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
  });
  
  socket.on("broadcaster", () => {
    socket.emit("watcher");
  });
  
  socket.on("disconnectPeer", () => {
    peerConnection.close();
  });

  initServices(socket);

}

const video = document.querySelector("video");

window.onunload = window.onbeforeunload = () => {
  socket.close();
};
