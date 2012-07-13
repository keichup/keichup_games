'use strict';
//CSS3とjavascriptでお遊び。
var h = 0
var socket;

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

var plus_num = 4//デフォルトは真ん中の４。
var btn_num = "0"//デフォルトは真ん中の４。

//sound
//var loopSound = new buzz.sound( "common/sound/click", {formats: [ "mp3"]});
var open_can_audio = new Audio( "common/sound/b1.wav" );
open_can_audio.load();

var open_can_audio2 = new Audio( "common/sound/b2.wav" );
open_can_audio2.load();

var st2_1 = new Audio( "common/sound/shoryuken.mp3" );
var st2_2 = new Audio( "common/sound/tatsumaki_senpukyaku.mp3" );

var btn_arry_dummy = ["#plus_btn","btn_B","btn_A","select_btn"]
var btn_arry = ["#plus_btn","btn_B","btn_A","select_btn"]

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
//とりあえず動かす操作を停止
document.ontouchmove = function(evt){
  evt.preventDefault();
}

window.onload = function() {
	set_body_height();
	window.addEventListener('orientationchange', setOrientation, false);
    	//set_loading()
	st2_1.load();
	st2_2.load();
	
}

$(document).ready(function(){
	//var loopSound = new buzz.sound( "common/sound/click", {formats: [ "mp3"]});
	//katamuki();
	socket = io.connect("192.168.0.39");
	touch_plus();
	touch_maru_B(); 
	touch_maru_A();
});

function set_body_height(){
	// 端末の向きを算出
	var isPortrait = window.innerHeight > window.innerWidth;
	
	// UserAgent から端末の種類を判別
	var ua = navigator.userAgent;
	var device;
	if (ua.search(/iPhone/) != -1 || ua.search(/iPod/) != -1) {
		device = "iPhone";
	} else if (ua.search(/Android/) != -1) {
          device = "Android";
	}
	
	// 端末の種類からページの高さを算出
	if (device == "Android") {
		h = Math.round(window.outerHeight / window.devicePixelRatio);
	} else if (device == "iPhone") {
		bar = (isPortrait ? 480 : screen.width) - window.innerHeight - (20 + (isPortrait ? 44 : 32));
		h = window.innerHeight + bar;
	} else {
		h = window.innerHeight;
	}
	
	// ページの高さをセット
	var body = $("body");
	if (body.height() < h) {
		body.height(h*2);
		//alert(h)
	}
	
	// ページをスクロール
	setTimeout(function() {
		scrollTo(0, 1);
	}, 100);
}

function touch_plus(){
	document.getElementById("plus_btn_set").ontouchstart = function(){
		open_can_audio2.play();
		var tObj = event.touches;
		var txt = "";
		for (var i=0; i<tObj.length; i++){
			var x = tObj[i].pageX-$("#plus_btn_set").position().left/2;
			var y = tObj[i].pageY-$("#plus_btn_set").position().top/2;
			txt += i+" = ("+x+", "+y+")<br>";
		}
		key_hanbetsu(x,y)
		//plus_katamuki(true,x,y);
		//document.getElementById("debug").innerHTML = txt;
		
	}
	
	document.getElementById("plus_btn_set").ontouchmove  = function(){
		var tObj = event.touches;
		var txt = "";
		for (var i=0; i<tObj.length; i++){
			var x = tObj[i].pageX-$("#plus_btn_set").position().left/2;
			var y = tObj[i].pageY-$("#plus_btn_set").position().top/2;
			txt += i+" = ("+x+", "+y+")<br>";
		}
		key_hanbetsu(x,y)
		//plus_katamuki(true,x,y);
		/*
		if(x>$("#plus_btn").width()/2 || y>$("#plus_btn").height()/2 ||x<0 || y<0){
			alert("over");
			plus_katamuki(false,0,0);
		}
		*/
		//document.getElementById("debug").innerHTML = txt;
	}
	document.getElementById("plus_btn_set").ontouchend = function(){
		document.getElementById("debug").innerHTML = "end_touch";
		//key_hanbetsu(x,y)
		if(btn_num != "0"){
			return;
		}else{
			send_plus_num(4);
		}
		//send_plus_num(4);
		plus_katamuki(false,0,0);
	}
}


function touch_maru_B(){
	document.getElementById("btn_B").ontouchstart = function(){
		socket.emit('btn', ['B','on']);
		btn_num = "B";
		//st2_2.play();
		open_can_audio.play();
		//document.getElementById("debug").innerHTML = "start_touch";
		//alert($("#btn_B").offset().left +":"+$("#btn_B").offset().top);
		var tObj = event.touches;
		var txt = "";
		for (var i=0; i<tObj.length; i++){
			var x = tObj[i].pageX-$("#btn_B").offset().left/2;
			var y = tObj[i].pageY-$("#btn_B").offset().top/2;
			
			txt += i+" = ("+x+", "+y+")<br>";
		}
		maru_katamuki_B(true,x,y,0);
		debug_text("B");
		//document.getElementById("debug").innerHTML = txt;
		
	}
	document.getElementById("btn_B").ontouchmove  = function(){
		//document.getElementById("debug").innerHTML = "move_touch";
		var tObj = event.touches;
		var txt = "";
		for (var i=0; i<tObj.length; i++){
			var x = tObj[i].pageX-$("#btn_B").offset().left/2;
			var y = tObj[i].pageY-$("#btn_B").offset().top/2;
			txt += i+" = ("+x+", "+y+")<br>";
		}
		maru_katamuki_B(true,x,y,0);
		//document.getElementById("debug").innerHTML = txt;
	}
	document.getElementById("btn_B").ontouchend = function(){
		socket.emit('btn', ['0','off']);
		debug_text("end_B");
		btn_num = "0";
		maru_katamuki_B(false,0,0,0);
	}
}

function touch_maru_A(){
	document.getElementById("btn_A").ontouchstart = function(){
		socket.emit('btn', ['A','on']);
		//st2_1.play();
		btn_num = "A";
		open_can_audio.play();
		//document.getElementById("debug").innerHTML = "start_touch";
		//alert($("#btn_B").offset().left +":"+$("#btn_B").offset().top)
		var tObj = event.touches;
		var txt = "";
		for (var i=0; i<tObj.length; i++){
			var x = tObj[i].pageX-$("#btn_A").offset().left/2;
			var y = tObj[i].pageY-$("#btn_A").offset().top/2;
			
			txt += i+" = ("+x+", "+y+")<br>";
		}
		maru_katamuki_A(true,x,y,0);
		debug_text("A");
		//document.getElementById("debug").innerHTML = txt;
	}
	
	document.getElementById("btn_A").ontouchmove  = function(){
		//document.getElementById("debug").innerHTML = "move_touch";
		var tObj = event.touches;
		var txt = "";
		for (var i=0; i<tObj.length; i++){
			var x = tObj[i].pageX-$("#btn_A").offset().left/2;
			var y = tObj[i].pageY-$("#btn_A").offset().top/2;
			txt += i+" = ("+x+", "+y+")<br>";
		}
		maru_katamuki_A(true,x,y,0);
		//document.getElementById("debug").innerHTML = txt;
	}
	document.getElementById("btn_A").ontouchend = function(){
		socket.emit('btn', ['0','off']);
		debug_text("end_A");
		btn_num = "0";
		maru_katamuki_A(false,0,0,0);
	}
}

function plus_katamuki(boo,x_num,y_num){
	
	if(boo ==false){//ボタンが離されたときか、外に出たとき
		//socket.emit('plus', ['4','off']);
		$("#plus_btn").css(
		{
			"opacity":"1",
	    		"-webkit-transform-origin":"50% 50%" ,
			"-webkit-transform-style":"preserve-3d",
			"-webkit-transform":" scale(1,1) perspective(220) rotateX(0deg) rotateY(0deg)",
			"-webkit-transition":"0.02s linear"
		});
	}else{
		//key_hanbetsu(x_num,y_num);
		var new_x = -(x_num-$("#plus_btn").height()/4)/5;
		var new_y = -(y_num-$("#plus_btn").height()/4)/5;
		
		$("#plus_btn").css(
		{
			"opacity":"1",
	    		"-webkit-transform-origin":"50% 50%",
			"-webkit-transform-style":"preserve-3d",
			"-webkit-transform": "scale(0.98,0.98) perspective(220) rotateX("+(new_y)+"deg)  rotateY("+(-new_x)+"deg)",
			"-webkit-transition":"0.02s linear"
		});
	}
}

function key_hanbetsu(xx,yy){
	
	/*
	--button_num--
	□■□ |0|1|2|
	■■■ |3|4|5|
	□■□ |6|7|8|
	*/
	var DX = xx - $("#plus_btn").height()/4;
	var DY = yy - $("#plus_btn").height()/4;
	
	var distance = Math.sqrt(Math.pow(DX,2) + Math.pow(DY,2));
	var radian = Math.atan2(DY,DX)
	var angle = radian/(Math.PI/180);
	
	if(angle < 0){
		angle = Math.abs(angle);
	}else{
		angle = 360 - angle;
	}
	
	if(distance < 20){
		plus_katamuki(false);
		//send_plus_num(4);
		debug_text("□□□<br>□■□<br>□□□");
		return;
		
	}else if(distance > 82){
		plus_katamuki(false);
		//send_plus_num(4);
		debug_text("end_touch");
		return;
	}
	
	if(angle >= 0 && angle < 30){
		send_plus_num(5);
		debug_text("□□□<br>□□■<br>□□□");
	}else if(angle >= 30 && angle < 60){
		send_plus_num(2);
		debug_text("□□■<br>□□□<br>□□□");
	}else if(angle >= 60 && angle < 120){
		send_plus_num(1);
		debug_text("□■□<br>□□□<br>□□□");
	}else if(angle >= 120 && angle < 150){
		send_plus_num(0);
		debug_text("■□□<br>□□□<br>□□□");
	}else if(angle >= 150 && angle < 210){
		send_plus_num(3);
		debug_text("□□□<br>■□□<br>□□□");
	}else if(angle >= 210 && angle < 240){
		send_plus_num(6);
		debug_text("□□□<br>□□□<br>■□□");
	}else if(angle >= 240 && angle < 300){
		send_plus_num(7);
		debug_text("□□□<br>□□□<br>□■□");
	}else if(angle >= 300 && angle < 330){
		send_plus_num(8);
		debug_text("□□□<br>□□□<br>□□■");
	}else if(angle >= 330 && angle < 360){
		send_plus_num(5);
		debug_text("□□□<br>□□■<br>□□□");
	}
	
	plus_katamuki(true,xx,yy);
	
}

function send_plus_num(num){
	if(plus_num == num ){
		return;
	}
	plus_num = num;
	debug_text("plus");
	socket.emit('plus', [""+ num +"",'on']);
}

function debug_text(text){
	var txt = "";
	txt += text;
	document.getElementById("debug").innerHTML = txt;
}

function maru_katamuki_A(boo,x_num,y_num,which){
	if(boo ==false){
		$("#btn_A .maru_btn").css(
		{
			"opacity":"1",
	    		"-webkit-transform-origin":"50% 50%" ,
			"-webkit-transform-style":"preserve-3d",
			"-webkit-transform": " scale(1,1) perspective(400) rotateX(0deg) rotateY(0deg)",
			"-webkit-transition":"0.02s linear"
		});
	}else{
		var new_x = -(x_num-$("#btn_A").height()/2)/5;
		var new_y = -(y_num-$("#btn_A").height()/2)/5;
		$("#btn_A .maru_btn").css(
		{
			"opacity":"0.6",
	    		"-webkit-transform-origin":"50% 50%" ,
			"-webkit-transform-style":"preserve-3d",
			//"-webkit-transform": "scale(0.95,0.95) perspective(400) rotateX("+(new_y)+"deg)  rotateY("+(-new_x)+"deg)", 
			"-webkit-transform": "scale(0.95,0.95)",
			"-webkit-transition":"0.02s linear"
		});
	}
}

function maru_katamuki_B(boo,x_num,y_num,which){
	if(boo ==false){
		$("#btn_B .maru_btn").css(
		{
			"opacity":"1",
	    		"-webkit-transform-origin":"50% 50%" ,
			"-webkit-transform-style":"preserve-3d",
			"-webkit-transform": " scale(1,1) perspective(400) rotateX(0deg) rotateY(0deg)",
			"-webkit-transition":"0.02s linear"
		});
	}else{
		var new_x = -(x_num-$("#btn_B").height()/2)/5;
		var new_y = -(y_num-$("#btn_B").height()/2)/5;
		$("#btn_B .maru_btn").css(
		{
			"opacity":"0.6",
	    		"-webkit-transform-origin":"50% 50%" ,
			"-webkit-transform-style":"preserve-3d",
			//"-webkit-transform": "scale(0.95,0.95) perspective(400) rotateX("+(new_y)+"deg)  rotateY("+(-new_x)+"deg)", 
			"-webkit-transform": "scale(0.95,0.95)",
			"-webkit-transition":"0.02s linear"
		});
	}
}


function set_loading()
{
	loading_con = document.createElement("div");//ローディングコンテナ
	loading_con.setAttribute("id","loading");
	loading_con.style.position = "absolute";
	loading_con.style.cssText = "margin: 0 auto; width:320px;height:480px; position:absolute; top:0px; left:0px; text-align: left;";
	document.body.appendChild(loading_con);
}

function katamuki()//傾き
{
	/*
	$("#plus_btn").css(
	{
		"-webkit-transform":"scale(1,1) translateX("+xg*7+"px) translateY("+(-yg*5+(-10*5))+"px)",
    		"-webkit-transform-origin":"100% 100%" ,
		"-webkit-transform-style":"preserve-3d",
		"-webkit-transition":"0.1s linear"
	});
	*/
	$("#plus_btn").css(
	{
    		"-webkit-transform-origin":"50% 50%" ,
		"-webkit-transform-style":"preserve-3d",
		/*"-webkit-transform":"scale(1,1) rotate3d(1,0,0,30deg)",*/
		"-webkit-transform": "perspective(800) rotateX(20deg)",
		"-webkit-transition":"0.1s linear"
	});
	setTimeout("katamuki()",100);
}

function setOrientation(e)//ローテーションイベント
{
	setTimeout(scrollTo, 0, 0, 1);
	//縦横変化時対応
	if(orientation == 0){
		//縦向きの時
		//div_con.style.cssText += "width:100%;height:100%;top:0px; left:47px;margin: 0 auto; -webkit-transform-origin: 0% 0%; -webkit-transition: all 0.5s ease-in-out;";
		//log_text.style.cssText = "background-color:#ffcc77; width:320px;height:30px; position:absolute; top:450px; left:0px; text-align: center;-webkit-transition: all 0.5s ease-in-out;"; 
	}else{
		//alert("yoko")
		//横向きの時
		//div_con.style.cssText += "100%;height:100%;top:0px; left:80px; margin: 0 auto; position:absolute;  -webkit-transition: all 0.5s ease-in-out;";
		//log_text.style.cssText = "margin: 0 auto; background-color:#ff2294; width:320px;height:30px; position:absolute; top:290px; left:0px; text-align: center;-webkit-transition: all 0.5s ease-in-out;";
	}
}

//-----------------------------------------------------------------------------------------------//
//---------------------------------------------加速度設定----------------------------------------//
//-----------------------------------------------------------------------------------------------//
window.addEventListener("devicemotion", function(evt){//加速度算出
	/*
	var x = evt.acceleration.x;// X方向の加速度
	var y = evt.acceleration.y;// Y方向の加速度
	var z = evt.acceleration.z;// Z方向の加速度
	*/
	
	xg = evt.accelerationIncludingGravity.x; // 横方向の傾斜
	yg = evt.accelerationIncludingGravity.y; // 縦方向の傾斜
	zg = evt.accelerationIncludingGravity.z; // 上下方向の傾斜
	
	/*
	log_text.innerHTML = "傾きx:"+xg+"傾きy:"+yg+"傾きz:"+zg;
	
	var txt = "x:"+x+"<br>y:"+y+"<br>z:"+z;
	var txt = "傾きx:"+xg+"<br>傾きy:"+yg+"<br>傾きz:"+zg+"<br>";
	txt += "alpha(Z):"+a+"<br>beta(X):"+b+"<br>gamma(Y):"+g;
	document.getElementById("sensor").innerHTML = "傾きx:"+xg+"<br>傾きy:"+yg+"<br>傾きz:"+zg+"<br>";
	*/
}, true);

/*
gestureChange =function(e){
	//alert("test")
}
*/
