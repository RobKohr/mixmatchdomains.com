var full = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
let socketUrl = location.protocol+'//'+location.hostname;
if(location.hostname==='localhost'){
  socketUrl+=':8000';
}else{
  socketUrl+=':'+location.port;
}

var socket = io(socketUrl);
