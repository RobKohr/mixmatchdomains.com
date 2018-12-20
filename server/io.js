const actions = require('./server-actions');

exports.init = function ({ http }) {
  var io = require('socket.io')(http);
  io.on('connection', function (socket) {
    console.log('a user connected');
    socket.data = {};
    socket.update = function (key, value) {
      socket.data[key] = value;
      socket.emit('update', socket.data);
    }
    socket.on('disconnect', function(){
      console.log('user disconnected');
      clearInterval(socket.updaterId);
      console.log(socket);
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

function timeUpdater(socket){
  setInterval(function(){
    socket.update('date', new Date());
  }, 1000)
}