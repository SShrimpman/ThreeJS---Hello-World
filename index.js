import {
    Scene,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    PerspectiveCamera,
    WebGLRenderer,
    MOUSE,
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    MathUtils,
    Clock
} from 'three';

import  CameraControls  from 'camera-controls';

const subsetOfTHREE = {
    MOUSE,
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    MathUtils: {
        DEG2RAD: MathUtils.DEG2RAD,
        clamp: MathUtils.clamp,
    }
};

// 1 the Scene

const scene = new Scene();
const canvas = document.getElementById('three-canvas');

// 2 the Object

const geometry = new BoxGeometry( 0.5, 0.5, 0.5);
const orangeMaterial = new MeshBasicMaterial( { color: 'orange' } );
const blueMaterial = new MeshBasicMaterial( { color: 'blue' } );

const orangeCube = new Mesh( geometry, orangeMaterial );
scene.add( orangeCube );

const bigBlueCube = new Mesh( geometry, blueMaterial );
bigBlueCube.position.x += 2;
bigBlueCube.scale.set(2, 2, 2);
scene.add( bigBlueCube );

// 3 the Camera

const camera = new PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight);
camera.position.z = 3;
scene.add(camera);

// 4 the Renderer

const renderer = new WebGLRenderer({ canvas });
renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );
renderer.setSize( canvas.clientWidth, canvas.clientHeight, false );

// 5 Responsivity

window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( canvas.clientWidth, canvas.clientHeight, false );
    
})

// 6 Controls

CameraControls.install( { THREE: subsetOfTHREE } );
const clock = new Clock();
const cameraControls = new CameraControls( camera, canvas );
cameraControls.dollyToCursor = true;


// 7 Animation

function animate() {
    const delta = clock.getDelta();
    cameraControls.update( delta );

    renderer.render( scene, camera );
    requestAnimationFrame( animate );
}
animate();