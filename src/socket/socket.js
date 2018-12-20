import openSocket from 'socket.io-client';


const location = window.location;
var full = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
let socketUrl = location.protocol+'//'+location.hostname;
if(location.hostname==='localhost'){
  socketUrl+=':8000';
}

const socket = openSocket(socketUrl);
let data = {};

function setCookie(c_name, value, exdays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
  document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
  var i, x, y, ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
      x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
      y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
      x = x.replace(/^\s+|\s+$/g, "");
      if (x == c_name) {
          return unescape(y);
      }
  }
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

let websocketSessionId = getCookie('websocketSessionId');
if(!websocketSessionId){
  websocketSessionId = uuidv4();
  setCookie('websocketSessionId', websocketSessionId, 1);
}
console.log(getCookie('websocketSessionId'));

const sendAction = function(action, params){
  socket.emit('action', {action:action, params:params});
}

socket.on('update', function(data){
  socket.onDataUpdate(data);
});


socket.on('errorMessage', function(msg){
  console.log("ERROR: "+msg);
});

socket.emit('setWebsocketSessionId', websocketSessionId);
socket.on('reconnected', function(){
  socket.emit('setWebsocketSessionId', websocketSessionId);  
})

function registerDataUpdateFunction(fun){
  socket.onDataUpdate = fun;
}

socket.on()

/*
module.exports = [
  sendAction,
  registerDataUpdateFunction
];
*/
export {sendAction, registerDataUpdateFunction};