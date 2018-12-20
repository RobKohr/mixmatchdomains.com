const db = require('./mongo')();

function handleFormErrors(socket, errors){
  socket.data.formErrors = errors;
  socket.update('formErrors', errors);
}

const { validator } = require('./validation');
 function register({username, password, retypePassword}, socket){
  validator('register', {username, password, retypePassword}, function(errors){
    if(errors){
      return handleFormErrors(socket, errors);
    }
  })
}

module.exports = {
  register
}