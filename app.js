// Change
// app.listen(3000, function() {
app.listen(process.env.PORT || 3000, function() {
// End
  console.log("Express server listening on port %d in %s mode",
      app.address().port, app.settings.env);
});
// Add
var socketio = require('socket.io');
var io = socketio.listen(app);
var count = 0;
setInterval(function() {
  var date = new Date();
  count++;
  io.sockets.emit('tick', date, count);
  console.log('AFTER: emit(): ' + date + ', ' + count);
}, 1000);
// End