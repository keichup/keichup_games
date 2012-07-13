//CSS3とjavascriptでお遊び。

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
	var socket = io.connect("192.168.0.39");
	touch_plus();
	touch_maru_l();
	touch_maru_r();
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
		plus_katamuki(true,x,y);
		document.getElementById("debug").innerHTML = txt;
		
	}
	document.getElementById("plus_btn_set").ontouchmove  = function(){
		var tObj = event.touches;
		var txt = "";
		for (var i=0; i<tObj.length; i++){
			var x = tObj[i].pageX-$("#plus_btn_set").position().left/2;
			var y = tObj[i].pageY-$("#plus_btn_set").position().top/2;
			txt += i+" = ("+x+", "+y+")<br>";
		}
		plus_katamuki(true,x,y);
		if(x>$("#plus_btn").width()/2 || y>$("#plus_btn").height()/2 ||x<0 || y<0){
			//alert("over");
			plus_katamuki(false,0,0);
		}
		document.getElementById("debug").innerHTML = txt;
	}
	document.getElementById("plus_btn_set").ontouchend = function(){
		document.getElementById("debug").innerHTML = "end_touch";
		plus_katamuki(false,0,0);
	}
}
function touch_maru_l(){
	document.getElementById("btn_l").ontouchstart = function(){
		//st2_2.play();
		open_can_audio.play();
		//document.getElementById("debug").innerHTML = "start_touch";
		//alert($("#btn_l").offset().left +":"+$("#btn_l").offset().top)
		var tObj = event.touches;
		var txt = "";
		for (var i=0; i<tObj.length; i++){
			var x = tObj[i].pageX-$("#btn_l").offset().left/2;
			var y = tObj[i].pageY-$("#btn_l").offset().top/2;
			
			
			txt += i+" = ("+x+", "+y+")<br>";
		}
		maru_katamuki_l(true,x,y,0);
		document.getElementById("debug").innerHTML = txt;
		
	}
	document.getElementById("btn_l").ontouchmove  = function(){
		//document.getElementById("debug").innerHTML = "move_touch";
		var tObj = event.touches;
		var txt = "";
		for (var i=0; i<tObj.length; i++){
			var x = tObj[i].pageX-$("#btn_l").offset().left/2;
			var y = tObj[i].pageY-$("#btn_l").offset().top/2;
			txt += i+" = ("+x+", "+y+")<br>";
		}
		maru_katamuki_l(true,x,y,0);
		document.getElementById("debug").innerHTML = txt;
	}
	document.getElementById("btn_l").ontouchend = function(){
		document.getElementById("debug").innerHTML = "end_touch";
		maru_katamuki_l(false,0,0,0);
	}
}

function touch_maru_r(){
	document.getElementById("btn_r").ontouchstart = function(){
		//st2_1.play();
		open_can_audio.play();
		//document.getElementById("debug").innerHTML = "start_touch";
		//alert($("#btn_l").offset().left +":"+$("#btn_l").offset().top)
		var tObj = event.touches;
		var txt = "";
		for (var i=0; i<tObj.length; i++){
			var x = tObj[i].pageX-$("#btn_r").offset().left/2;
			var y = tObj[i].pageY-$("#btn_r").offset().top/2;
			
			
			txt += i+" = ("+x+", "+y+")<br>";
		}
		maru_katamuki_r(true,x,y,0);
		document.getElementById("debug").innerHTML = txt;
		
	}
	document.getElementById("btn_r").ontouchmove  = function(){
		//document.getElementById("debug").innerHTML = "move_touch";
		var tObj = event.touches;
		var txt = "";
		for (var i=0; i<tObj.length; i++){
			var x = tObj[i].pageX-$("#btn_r").offset().left/2;
			var y = tObj[i].pageY-$("#btn_r").offset().top/2;
			txt += i+" = ("+x+", "+y+")<br>";
		}
		maru_katamuki_r(true,x,y,0);
		document.getElementById("debug").innerHTML = txt;
	}
	document.getElementById("btn_r").ontouchend = function(){
		document.getElementById("debug").innerHTML = "end_touch";
		maru_katamuki_r(false,0,0,0);
	}
}


function plus_katamuki(boo,x_num,y_num){
	if(boo ==false){
		$("#plus_btn").css(
		{
			"opacity":"1",
	    		"-webkit-transform-origin":"50% 50%" ,
			"-webkit-transform-style":"preserve-3d",
			"-webkit-transform": " scale(1,1) perspective(220) rotateX(0deg) rotateY(0deg)",  
			"-webkit-transition":"0s linear"
		});
	}else{
		var new_x = -(x_num-$("#plus_btn").height()/4)/5;
		var new_y = -(y_num-$("#plus_btn").height()/4)/5;
		
		$("#plus_btn").css(
		{
			"opacity":"1",
	    		"-webkit-transform-origin":"50% 50%" ,
			"-webkit-transform-style":"preserve-3d",
			"-webkit-transform": "scale(0.98,0.98) perspective(220) rotateX("+(new_y)+"deg)  rotateY("+(-new_x)+"deg)",  
			"-webkit-transition":"0s linear"
		});
	}
}

function maru_katamuki_r(boo,x_num,y_num,which){
	if(boo ==false){
		$("#btn_r .maru_btn").css(
		{
			"opacity":"1",
	    		"-webkit-transform-origin":"50% 50%" ,
			"-webkit-transform-style":"preserve-3d",
			"-webkit-transform": " scale(1,1) perspective(400) rotateX(0deg) rotateY(0deg)",  
			"-webkit-transition":"0s linear"
		});
	}else{
		var new_x = -(x_num-$("#btn_r").height()/2)/5;
		var new_y = -(y_num-$("#btn_r").height()/2)/5;
		$("#btn_r .maru_btn").css(
		{
			"opacity":"0.6",
	    		"-webkit-transform-origin":"50% 50%" ,
			"-webkit-transform-style":"preserve-3d",
			//"-webkit-transform": "scale(0.95,0.95) perspective(400) rotateX("+(new_y)+"deg)  rotateY("+(-new_x)+"deg)", 
			"-webkit-transform": "scale(0.95,0.95)",  
			"-webkit-transition":"0s linear"
		});
	}
}		

function maru_katamuki_l(boo,x_num,y_num,which){
	if(boo ==false){
		$("#btn_l .maru_btn").css(
		{
			"opacity":"1",
	    		"-webkit-transform-origin":"50% 50%" ,
			"-webkit-transform-style":"preserve-3d",
			"-webkit-transform": " scale(1,1) perspective(400) rotateX(0deg) rotateY(0deg)",  
			"-webkit-transition":"0s linear"
		});
	}else{
		var new_x = -(x_num-$("#btn_l").height()/2)/5;
		var new_y = -(y_num-$("#btn_l").height()/2)/5;
		$("#btn_l .maru_btn").css(
		{
			"opacity":"0.6",
	    		"-webkit-transform-origin":"50% 50%" ,
			"-webkit-transform-style":"preserve-3d",
			//"-webkit-transform": "scale(0.95,0.95) perspective(400) rotateX("+(new_y)+"deg)  rotateY("+(-new_x)+"deg)", 
			"-webkit-transform": "scale(0.95,0.95)",  
			"-webkit-transition":"0s linear"
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
