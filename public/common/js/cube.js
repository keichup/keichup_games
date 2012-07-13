var camera, scene, renderer, loader, mesh, stats, ambientLight, directionalLight , projector , particleMaterial ,car, body, lfw, rfw, lrw, rrw, bm, dt, ta, debug;
//var dae , skin ,flipSided;
var dae_sky,dae_sky_skin;
var canvas;
var trackball;
var t = 0;
var store_num = 50;
var store_now_num = 0
var store_arr = [];
var store_arr_ch = [];
var meshArray = [];

var socket

if (Detector.webgl){

}else {
    Detector.addGetWebGLMessage();
}

//make_collada();

var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load( 'common/collada/sky.dae', function colladaReady( collada ) {
	
	dae_sky = collada.scene;
	dae_sky_skin = collada.skins[ 0 ];
	
	dae_sky.scale.x = dae_sky.scale.y = dae_sky.scale.z = 0.3;
	dae_sky.updateMatrix();
	
	init();
	animate();
} );

$(document).ready(function(){
	
	socket = io.connect("192.168.0.39");
	
	socket.on('connect', function() {
	});
	socket.on('push_click', function (msg) {
		var color = Math.random() *1000
		$("#chara").animate({top: color,left: color});
		//trace("OK")
		camera.position.x += 0.1
	});
});

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
	window.addEventListener( 'resize', onWindowResize, false );
	/*----------------------------------------------------------------------------make_stage--*/
	var container = document.getElementById("container");
	scene = new THREE.Scene;
	
	
	/*------------------------------------------------------------------------make_camera--*/
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.set( 2, 2, 3 );
	scene.add( camera );
	
	
	/*------------------------------------------------------------------------make_light--*/
	ambientLight = new THREE.AmbientLight(8421504);
	scene.add(ambientLight);
	/*
    	directionalLight = new THREE.DirectionalLight(16777215, 1.5);
    	directionalLight.position.x = 0;
   	directionalLight.position.y = 1;
   	directionalLight.position.z = 5;
   	directionalLight.position.normalize();
	scene.add(directionalLight);
	*/
	
	
	/*-----------------------------------------------------------------------make_GRID--*/
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
	
	
	/*-----------------------------------------------------------------------make_render--*/
	renderer = new THREE.WebGLRenderer({antialias: true});
    	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);
	renderer.setClearColorHex(0xffea00, 1.0);
	renderer.clear();
	
	//trackball = new THREE.TrackballControls( camera, renderer.domElement );//trackball カメラの移動スクリプト
	
	
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
	scene.add(dae_sky);
	/*------------------------------------------------------------------put_store_polygon--*/
	scene.fog = new THREE.FogExp2( 0xffea00, 0.03 );
	/*
	var gui = new DAT.GUI();
	gui.add(dae.scale, 'x').min(0.1).max(10).step(0.1);
	gui.add(dae.scale, 'y', 0.1, 10, 0.1);
	gui.add(dae.scale, 'z', 0.1, 10, 0.1);
	*/
	
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
	projector = new THREE.Projector();
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	
	draw_logo();
	//renderer.render(scene, camera);
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
		//intersects[0].object.material.color.setHex( color );
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
	
	
	theta += 0.2;
	/*
	camera.position.x = radius * Math.sin( theta * Math.PI / 360 );
	camera.position.y = radius * Math.sin( theta * Math.PI / 360 );
	camera.position.z = radius * Math.cos( theta * Math.PI / 360 );
	camera.lookAt( scene.position );
	*/
	renderer.render( scene, camera );
}

/*
function render() {

	var timer = Date.now() * 0.0005;
	camera.position.x = Math.cos( timer ) * 10;
	camera.position.y = 1;
	camera.position.z = Math.sin( timer ) * 10;

	camera.lookAt( scene.position );
	
	renderer.render( scene, camera );

}
*/


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
