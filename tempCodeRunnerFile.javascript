var mpg = require('mpg123');
 
var player = new mpg.MpgPlayer();
 
player.play(__dirname+'/'+"morning_call.mp3");