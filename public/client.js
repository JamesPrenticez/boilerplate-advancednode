$(document).ready(function () {
  /*global io*/
  let socket = io();
  /* Note:io() works only when connecting to a socket hosted on the same url/server. For connecting to an external socket hosted elsewhere, you would use io.connect('URL');.*/

  //Listen for the user name and count 
  socket.on('user', (data) => {
    $('#num-users').text(data.currentUsers + ' users online');
    let message = data.name + (data.connected ? ' has joined the chat.' : ' has left the chat.');
    $('#messages').append($('<li>').html('<b>' + message + '</b>'));
  });

  //Listen for a message
  socket.on('chat message', (data) => {
    console.log('socket.on 1');
    $('#messages').append($('<li>').text(`${data.name}: ${data.message}`));
  });

  // Form submition with new message in field with id 'm'
  $('form').submit(function () {
    var messageToSend = $('#m').val();
    // Send message to server
    socket.emit('chat message', messageToSend);
    $('#m').val('');
    return false; // prevent form submit from refreshing page
  });
});
