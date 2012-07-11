//CSS3とjavascriptでお遊び。
var socket

//画像のパス
var loading_img = [
	{"image":"images/loading.png"},
]

var page = [
	{"image":"images/cat003.png"},
	{"image":"images/cat002.png"},
	{"image":"images/cat001.png"},
	{"image":"images/cat000.png"},
]

var item = [
	{"image":"images/eye_l.png"},
	{"image":"images/eye_r.png"},
]


//sound
//var loopSound = new buzz.sound( "common/sound/click", {formats: [ "mp3"]});
var open_can_audio = new Audio( "common/sound/b1.wav" );
open_can_audio.load();

var open_can_audio2 = new Audio( "common/sound/b2.wav" );
open_can_audio2.load();

var st2_1 = new Audio( "common/sound/shoryuken.mp3" );
var st2_2 = new Audio( "common/sound/tatsumaki_senpukyaku.mp3" );

var btn_arry_dummy = ["#plus_btn","btn_l","btn_r","select_btn"]
var btn_arry = ["#plus_btn","btn_l","btn_r","select_btn"]

//変数設定
var nowtext_num =0
var loading_num = 0;
var load_delay = 0;
var orientation = 0;
var cat002_i = 0;

var xg = 0;
var yg = 0;
var zg = 0;


//-----------------------------------------------------------------------------------------------//
//---------------------------------------ここからいろいろはじまります----------------------------//
//-----------------------------------------------------------------------------------------------//
$(document).ready(function(){
	socket = io.connect("192.168.0.39");

	socket.on('connect', function() {
  	//log('connected');
	});
	socket.on('push_click', function (msg) {
		var color = Math.random() *1000
		$("#chara").animate({top: color,left: color});
	});
});
