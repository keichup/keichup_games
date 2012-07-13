//You're so fucking special.

var camera, scene, renderer, loader, mesh, stats, ambientLight, directionalLight , projector , particleMaterial ,car, body, lfw, rfw, lrw, rrw, bm, dt, ta, debug;
//var dae , skin ,flipSided;
var ground,dae_sky,dae_sky_skin,chara_rigid,chara_group,boxes = [];
var canvas;
var trackball;
var t = 0;
var store_num = 50;
var store_now_num = 0
var store_arr = [];
var store_arr_ch = [];
var meshArray = [];
var plus_num = 4;
var btn_nun = "0";
var socket;
var object;
var _vector = new THREE.Vector3;
var block_offset = new THREE.Vector3;
var btn_A = false;
var i = 0;
var mouse_position;
var box_num = 30;

var video, texture;
var composer;
/*
var accelerate = 0.005;
var accelerate_new = 0.005;
var decelerate = 0.002;

var max_speed = 0.05;
var max_speed_new = 0.05;
*/
// maybe replace that by window... or something
var userOpts	= {
	accelerate	: 0.005,
	accelerate_new	: 0.005,
	decelerate	: 0.01,
	max_speed	: 0.08,
	max_speed_new	: 0.08,
	easing		: 'Elastic.EaseInOut'
};

var chara_jump	= {
	range		: 2,
	duration	: 1000,
	delay		: 0,
	easing_up	: 'Cubic.EaseOut',
	easing_down	: 'Cubic.EaseIn'
};



Physijs.scripts.worker = 'common/js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

if (Detector.webgl){

}else {
    Detector.addGetWebGLMessage();
}

//make_collada();

window.onload = initScene;

function initScene(){
	
	init();
	
}

function make_chara(){
	
	chara_rigid = new Physijs.BoxMesh(
		new THREE.CubeGeometry( 4, 4, 4 ),
		ground_material,
		1000 //mass
	);
	chara_rigid.visible = false;
	//chara_rigid.castShadow = true;
	
	chara_rigid.position.set(
		0,
		10 + Math.random() * 5,
		0
	);
	chara_rigid.addEventListener( 'collision', handleCollision );
	
	/*
	chara_rigid.position.set(
		0,
		2,
		0
	);
	*/

	var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
	loader.load( 'common/collada/c_c.dae', function colladaReady( collada ) {
		
		dae_sky = collada.scene;
		dae_sky_skin = collada.skins[ 0 ];
		trace(dae_sky)
		dae_sky.scale.x = dae_sky.scale.y = dae_sky.scale.z = 1;
		dae_sky.position.y = -0.7;
		dae_sky.updateMatrix();

		chara_rigid.add( dae_sky );
		scene.add(chara_rigid);
		
		animate();
	} );
}

function handleCollision()
{
	btn_A = false;
	trace("chara_touch")
}

$(document).ready(function(){
	
	socket = io.connect("192.168.0.39");
	
	socket.on('connect', function() {
	});
	
	socket.on('plus_click', function (plus) {
		trace(plus);
		plus_num = plus;
		
	});
	
	socket.on('btn_click', function (btn) {
		trace(btn);
		btn_nun = btn;
	});
	
});

function setupTween()
{
	trace(dae_sky.scale.y)
	// 
	var update	= function(){
		dae_sky.scale.y = current.y;
	}
	var current	= { y : 1.5 };
	
	// remove previous tweens if needed
	//TWEEN.removeAll();
	//tweenHead.start();
	// convert the string from dat-gui into tween.js functions 
	var easing_1	= TWEEN.Easing[chara_jump.easing_up.split('.')[0]][chara_jump.easing_up.split('.')[1]];
	var easing_2	= TWEEN.Easing[chara_jump.easing_down.split('.')[0]][chara_jump.easing_down.split('.')[1]];
	// build the tween to go ahead
	var tweenHead	= new TWEEN.Tween(current)
		.to({y: +chara_jump.range}, chara_jump.duration)
		.delay(chara_jump.delay)
		.easing(easing_1)
		.onUpdate(update);
	// build the tween to go backward
	var tweenBack	= new TWEEN.Tween(current)
		.to({y: 1}, chara_jump.duration)
		.delay(chara_jump.delay)
		.easing(easing_2)
		.onUpdate(update);

	// after tweenHead do tweenBack
	tweenHead.start();
	tweenHead.chain(tweenBack);
	// after tweenBack do tweenHead, so it is cycling
	//tweenBack.chain(tweenHead);

	// start the first
}

function buildGui(options, callback)
{
	// collect all available easing in TWEEN library
	var easings	= {};
/*
	Object.keys(TWEEN.Easing).forEach(function(family){
		Object.keys(TWEEN.Easing[family]).forEach(function(direction){
			var name	= family+'.'+direction;
			easings[name]	= name;
		});
	});
*/
	// the callback notified on UI change
	var change	= function(){
		callback(options)
	}
	// create and initialize the UIs
	var gui = new DAT.GUI({ height	: 6 * 32 - 1 });
	gui.add(options, 'accelerate').name('accelerate').min(0.001).max(0.1)		.onChange(change);
	gui.add(options, 'accelerate_new').name('accelerate_new').min(0.001).max(0.1)	.onChange(change);
	gui.add(options, 'decelerate').name('decelerate').min(0.001).max(0.1)		.onChange(change);
	gui.add(options, 'max_speed').name('max_speed').min(0.01).max(1)		.onChange(change);
	gui.add(options, 'max_speed_new').name('max_speed_new').min(0.01).max(1)	.onChange(change);
	gui.add(options, 'easing').name('Easing Curve').options(easings)		.onChange(change);
}

/*
function make_collada(){
	var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
	
	loader.load( 'common/collada/logo.dae', function colladaReady( collada ) {
		
		for( var i = 0; i < store_num; i++ ){
			
			store_now_num++
			
			var dae = collada.scene;
			var skin = collada.skins[ 0 ];
			
			dae.scale.x = dae.scale.y = dae.scale.z = (Math.random()*1)/2;
			dae.position.x = (Math.random()*50)-25;
			dae.position.y = (Math.random()*50)-25;
			dae.position.z = (Math.random()*50)-25;
			
			dae.rotation.y = (Math.random()*360)-180;
			
			dae.updateMatrix();
			
			var mesh = dae.children.filter(function(child){
    				return child instanceof THREE.Mesh;
  			})[0];
			
			dae.geometry = mesh.geometry;
			
			mesh = new THREE.MeshBasicMaterial( { color: 0x888888, wireframe: true } );
			
			store_arr.push(dae);
			
			store_arr_ch.push(dae.children[0])
			if(store_now_num == store_num){
				init();
				animate();
			}
		}
	});
}
*/
function draw_logo(){
	canvas = document.createElement( "container" );
	canvas.width = 1000;
	canvas.height = 1000;
	
	//draw();
	//context = canvas.getContext( '2d' );
}

function init() {
	buildGui(userOpts, function(){
		//console.log("userOpts", userOpts)
		//setupTween();
	});
	
	projector = new THREE.Projector();
	
	window.addEventListener( 'resize', onWindowResize, false );
	/*----------------------------------------------------------------------------make_stage--*/
	var container = document.getElementById("container");
	//scene = new THREE.Scene;
	scene = new Physijs.Scene;
	
	
	/*------------------------------------------------------------------------make_camera--*/
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.set( 2, 2, 3 );
	scene.add( camera );
	
	
	/*-----------------------------------------------------------------------make_GRID--*/
	/*
	var line_material = new THREE.LineBasicMaterial( { color: 0xcccccc, opacity: 0.2 } ),
	geometry = new THREE.Geometry(),
	floor = -0.04, step = 1, size = 14;
	
	for ( var i = 0; i <= size / step * 2; i ++ ) {
		geometry.vertices.push( new THREE.Vector3( - size, floor, i * step - size ) );
		geometry.vertices.push( new THREE.Vector3( size, floor, i * step - size ) );
		
		geometry.vertices.push( new THREE.Vector3( i * step - size, floor, -size ) );
		geometry.vertices.push( new THREE.Vector3( i * step - size, floor, size ) );
	}
	
	var line = new THREE.Line( geometry, line_material, THREE.LinePieces );
	scene.add( line );
	*/
	
	/*-----------------------------------------------------------------------make_render--*/
	renderer = new THREE.WebGLRenderer({antialias: true});
    	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	renderer.setClearColorHex(0xffea00, 1.0);
	container.appendChild(renderer.domElement);

	//trackball = new THREE.TrackballControls( camera, renderer.domElement );//trackball カメラの移動スクリプト
	
	
	/*------------------------------------------------------------------------make_light--*/
	/*ambientLight = new THREE.AmbientLight(8421504);
	scene.add(ambientLight);
	*/
	
    	directionalLight = new THREE.DirectionalLight(16777215, 0.5);
	directionalLight.position.set( 0, 50, 50 );
	directionalLight.target.position.copy( scene.position );
	directionalLight.castShadow = true;
	//directionalLight.shadowCameraVisible = true;
	directionalLight.shadowCameraLeft = -60;
	directionalLight.shadowCameraTop = -60;
	directionalLight.shadowCameraRight = 60;
	directionalLight.shadowCameraBottom = 60;
	directionalLight.shadowCameraNear = 20;
	directionalLight.shadowCameraFar = 200;
	directionalLight.shadowBias = -.0001
	directionalLight.shadowMapWidth = directionalLight.shadowMapHeight = 2048;
	directionalLight.shadowDarkness = .7;
	scene.add(directionalLight);
	
	
	/*--------------------------------------------------------------------make_FPS_stats--*/
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );
	
	/*
	var geometry = new THREE.CubeGeometry(2, 2, 2, 6, 6, 6);
	for(var i = 0; i < 5; i++){
		meshArray[i] = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
		meshArray[i].position.x = 2 * i;
		meshArray[i].position.z = -i;
		scene.add( meshArray[i] );
	}
	*/
	
	/*------------------------------------------------------------------put_store_polygon--*/
	/*
	for( var i = 0; i < store_num; i++ ){
		trace(i)
		scene.add(store_arr[i]);
	}
	*/
	/*
	var mesh = dae.children.filter(function(child){
    				return child instanceof THREE.Mesh;
  			})[0];
		
	dae.geometry = mesh.geometry;
	console.log(dae)
	scene.add(dae);
	*/
	
	video = document.getElementById( 'video' );

	texture = new THREE.Texture( video );
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	texture.format = THREE.RGBFormat;
	
	/*------------------------------------------------------------------put_store_polygon--*/
	scene.fog = new THREE.FogExp2( 0xffea00, 0.005 );
	/*
	var PI2 = Math.PI * 2;
	particleMaterial = new THREE.ParticleCanvasMaterial( {
	
		color: 0x000000,
		program: function ( context ) {
		
			context.beginPath();
			context.arc( 0, 0, 1, 0, PI2, true );
			context.closePath();
			context.fill();
		}
	} );
	
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	draw_logo();
	
	*/
	//Materials
	ground_material = Physijs.createMaterial(
		//new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( 'images/rocks.jpg' ) }),
		new THREE.MeshBasicMaterial({ color: 0x999999 }),
		1, // high friction
		0.1 // low restitution
	);
	
	movie_material = Physijs.createMaterial(
		//new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( 'images/rocks.jpg' ) }),
		new THREE.MeshBasicMaterial({ color: 0xFFFFFF }),
		1, // high friction
		1 // low restitution
	);
	//ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
	//ground_material.map.repeat.set( 30, 30 );
	
	//Ground
	ground = new Physijs.BoxMesh(
		new THREE.CubeGeometry(1000, 1, 1000),
		ground_material,
		0 // mass
	);
	ground.receiveShadow = true;
	scene.add( ground );
	
	//movie_box
	movie_box = new Physijs.BoxMesh(
		new THREE.CubeGeometry(16, 9, 1),
		movie_material,
		0 // mass
	);
	movie_box.position.x = 10;
	movie_box.position.y = 7;
	movie_box.position.z = -5;
	movie_box.castShadow = true;
	scene.add( movie_box );
	
	createBox();
	make_chara()
}

function createBox(){
	var box, material;
	
	for ( var i = 0; i < box_num; i++ ) {
		
		material = Physijs.createMaterial(
    			new THREE.MeshBasicMaterial({ color: 0x5ccccc }),
    			1,
    			0.1
		);
		
		box = new Physijs.BoxMesh(
			new THREE.CubeGeometry( 4, 4, 4 ),
			material,
			500
		);
		
		box.position.set(
			Math.random() * 1000 - 500,
			10 + Math.random() * 5,
			0
		);
		
		box.rotation.set(
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2
		);
		
		box.castShadow = true;
		scene.add( box );
		boxes.push( box );
	}
}

function onDocumentMouseDown( event ) {
	//console.log("click");
	event.preventDefault();
	
	var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
	projector.unprojectVector( vector, camera );
	
	var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
	
	var intersects = ray.intersectObjects( store_arr_ch );
	
	console.log(intersects.length)
	
	if ( intersects.length > 0 ) {
		console.log(intersects[0].object);
		intersects[0].object.scale.x = 2;
		var color = Math.random() * 0xffffff;
		intersects[0].object.material.emissive.setHex( color );
	}
}

function animate() {
	
	requestAnimationFrame( animate );
	/*
	if ( t > 30 ) t = 0;

	if ( skin ) {
		
		// guess this can be done smarter...
		
		// (Indeed, there are way more frames than needed and interpolation is not used at all
		// could be something like - one morph per each skinning pose keyframe, or even less,
		// animation could be resampled, morphing interpolation handles sparse keyframes quite well.
		// Simple animation cycles like this look ok with 10-15 frames instead of 100 ;)
		
		for ( var i = 0; i < skin.morphTargetInfluences.length; i++ ) {
		
			skin.morphTargetInfluences[ i ] = 0;
		
		}
		
		skin.morphTargetInfluences[ Math.floor( t ) ] = 1;
		t += 0.5;
	}
	*/
	//trackball.update();
	render();
	stats.update();
}

var radius = 10;
var theta = 0;

function render() {
	
	applyForce();
	set_btn();
	TWEEN.update();
	scene.simulate(undefined, 1);
	/*
	theta += 0.2;
	camera.position.x = radius * Math.sin( theta * Math.PI / 360 );
	camera.position.y = radius * Math.sin( theta * Math.PI / 360 );
	camera.position.z = radius * Math.cos( theta * Math.PI / 360 );
	*/
	camera.position.x = chara_rigid.position.x;
	camera.position.y = chara_rigid.position.y+2;
	camera.position.z = 20;
	
	camera.lookAt( chara_rigid.position.x,chara_rigid.position.y+2,chara_rigid.position.z );
	
	renderer.render( scene, camera );
}

function applyForce(){
	
	//var force = THREE.Vector3(0, 100, 0)
	//var newForce = chara_rigid.matrix.multiplyVector3(force);
	//chara_rigid.applyCentralImpulse(newForce);
/*
	var rotation_matrix = new THREE.Matrix4();
	rotation_matrix.extractRotation(chara_rigid.matrix);
	var force_vector = new THREE.Vector3(0, 100, 0);
	var final_force_vector = rotation_matrix.multiplyVector3(force_vector);
	chara_rigid.applyCentralForce(final_force_vector);
	*/
	//chara_rigid.applyCentralImpulse(chara_rigid.matrix.multiplyVector3(new THREE.Vector3(0, 5000, 0)));
	//box = boxes[i];
	/*
	distance = mouse_position.distanceTo( box.position ),
	effect = mouse_position.clone().subSelf( chara_rigid.position ).normalize().multiplyScalar( strength / distance ).negate(),
	offset = mouse_position.clone().subSelf( chara_rigid.position );
	chara_rigid.applyImpulse( effect, offset );
	*/
};

function set_btn(){
	//_vector.set(chara_rigid.position);
	
	if(btn_nun[0] =="B"){
		userOpts.accelerate = userOpts.accelerate_new*2;
		userOpts.max_speed = userOpts.max_speed_new*6;
	}else if(btn_nun[0] !="B"){
		userOpts.accelerate = userOpts.accelerate_new;
		userOpts.max_speed = userOpts.max_speed_new;
	}
	
	if(btn_nun[0] == "A" && btn_A == false){
	//if(btn_nun[0] == "A"){
		trace("A")
		btn_A = true;
		//setupTween()
		chara_rigid.applyCentralImpulse(chara_rigid.matrix.multiplyVector3(new THREE.Vector3(0, 10000, 0)));
	}
	
	if(plus_num[0] == 0 || plus_num[0] == 1 || plus_num[0] == 2 || plus_num[0] == 4 || plus_num[0] == 6 || plus_num[0] == 7 || plus_num[0] == 8){
		
		if(i >= 0){
			if(i<userOpts.accelerate && i>0){
				return;
			}
			i -= userOpts.decelerate;
		}else if(i <= 0){
			if(i>-(userOpts.accelerate) && i<0){
				return;
			}
			i += userOpts.decelerate;
		}
		chara_rigid.position.x += i;
		
	}else if(plus_num[0] == 5){//右移動
		
		if(i <= userOpts.max_speed){
			i += userOpts.accelerate;
		}else if(i > userOpts.max_speed){
			i -= userOpts.accelerate;
		}
		chara_rigid.position.x += i;
		
	}else if(plus_num[0] == 3){//左移動
		
		if(i >= -(userOpts.max_speed)){
			i -= userOpts.accelerate;
		}else if(i < -(userOpts.max_speed)){
			i += userOpts.accelerate;
		}
		chara_rigid.position.x += i;
	}
	chara_rigid.position.z = 0;
	//chara_rigid.position.add( chara_rigid );
	chara_rigid.__dirtyPosition = true;
	//chara_rigid.position.add( chara_rigid, block_offset );
	
	chara_rigid.setAngularFactor( _vector );
	chara_rigid.setAngularVelocity( _vector );
	//chara_rigid.setLinearFactor( _vector );
	//chara_rigid.setLinearVelocity( _vector );
	
	_vector.set( 0, 0, 0 );
	
	for ( a = 0; a < box_num; a++ ) {
		boxes[a].applyCentralImpulse( _vector );
		//boxes[a].position.z = 0;
		
	}
}

/*----------------------------------------------------------------------------resize*/
function onWindowResize( event ) {
	
	var newWidth = (window.innerWidth > 1920) ? 1920 : window.innerWidth;
	var newHeight = (window.innerHeight > 1200) ? 1200 : window.innerHeight;
	
	var percent = newWidth / 1920;
	var newFontSize = 12 * percent;
	
	camera.aspect = newWidth / newHeight;
	camera.updateProjectionMatrix();
	
	renderer.setSize( newWidth, newHeight );
	
}
