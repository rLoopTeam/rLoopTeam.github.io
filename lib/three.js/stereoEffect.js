/**
 * @author alteredq / http://alteredqualia.com/
 * @authod mrdoob / http://mrdoob.com/
 * @authod arodic / http://aleksandarrodic.com/
 * @authod fonserbc / http://fonserbc.github.io/
*/

define(["../three.js/three"], function(THREE){

	THREE.StereoEffect = function (renderer) {

		var _stereo = new THREE.StereoCamera();
		_stereo.aspect = 0.5;

		this.renderer = renderer;

		this.setEyeSeparation = function ( eyeSep ) {

			_stereo.eyeSep = eyeSep;

		};

		this.setSize = function ( width, height ) {

			this.renderer.setSize( width, height );

		};

		this.render = function ( scene, camera ) {

			scene.updateMatrixWorld();

			if ( camera.parent === null ) camera.updateMatrixWorld();

			_stereo.update( camera );

			var size = this.renderer.getSize();

			this.renderer.clear();
			this.renderer.setScissorTest( true );

			this.renderer.setScissor( 0, 0, size.width / 2, size.height );
			this.renderer.setViewport( 0, 0, size.width / 2, size.height );
			this.renderer.render( scene, _stereo.cameraL );

			this.renderer.setScissor( size.width / 2, 0, size.width / 2, size.height );
			this.renderer.setViewport( size.width / 2, 0, size.width / 2, size.height );
			this.renderer.render( scene, _stereo.cameraR );

			this.renderer.setScissorTest( false );

		};
	};

	return THREE.StereoEffect;
});
