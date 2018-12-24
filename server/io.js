const actions = require('./server-actions');

exports.init = function ({ http }) {
  var io = require('socket.io')(http);
  io.on('connection', function (socket) {
    console.log('a user connected');
    socket.data = {};
    socket.update = function (key, value) {
      if(!socket.data){
        socket.data = {};
      }
      socket.data[key] = value;
      socket.sendUpdatedData();
    }
    socket.sendUpdatedData = function(data){
      if(data){
        socket.data = data;
      }
      socket.emit('update', socket.data);
    }
    socket.on('disconnect', function(){
      console.log('user disconnected');
      clearInterval(socket.updaterId);
    })
    socket.updaterId = timeUpdater(socket);
    socket.on('action', function ({action, params}) {
      console.log({action, params})
      if(actions[action]){
        if(!params) {
          params = {};
        }
        actions[action](params, socket);
      }
    });
  });
}

var exec = require('child_process').exec;
function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

function timeUpdater(socket){
  return setInterval(function(){
    //updateDomains(socket);
  }, 1000)
}

