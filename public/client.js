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

  // Form submition with new message in field with id 'm'
  $('form').submit(function () {
    var messageToSend = $('#m').val();
    // Send message to server here?
    $('#m').val('');
    return false; // prevent form submit from refreshing page
  });
});
