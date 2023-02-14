import {
    Scene,
    BoxGeometry,
    DirectionalLight,
    MeshBasicMaterial,
    MeshLambertMaterial,
    MeshPhongMaterial,
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
    Clock,
    TextureLoader,
    AmbientLight,
    HemisphereLight,
    SphereGeometry
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

const loader = new TextureLoader();

const geometry = new SphereGeometry( 0.5);

const orangeMaterial = new MeshLambertMaterial( { color: 'orange' } );
const blueMaterial = new MeshLambertMaterial( { color: 'blue' } );
const whiteMaterial = new MeshLambertMaterial( { color: 'white' } );

const sun = new Mesh( geometry, orangeMaterial );
scene.add( sun );

const earth = new Mesh( geometry, blueMaterial );
earth.scale.set( 0.2, 0.2, 0.2);
earth.position.x += 2;
sun.add( earth );


const moon = new Mesh( geometry, whiteMaterial );
moon.scale.set( 0.5, 0.5, 0.5);
moon.position.x += 1;
earth.add( moon );


// 3 the Camera

const camera = new PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight);
camera.position.z = 3;
scene.add(camera);

// 4 the Renderer

const renderer = new WebGLRenderer({ canvas });
renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );
renderer.setSize( canvas.clientWidth, canvas.clientHeight, false );

// 5 Lights

const light1 = new DirectionalLight();
light1.position.set(3, 2, 1).normalize();
scene.add( light1 );

const hemiSphereLight = new HemisphereLight(0xb1e1ff, 0x7075ff);
scene.add( hemiSphereLight );

// const light2 = new DirectionalLight();
// light2.position.set(-3, -2, -1).normalize();
// scene.add( light2 );

// 6 Responsivity

window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( canvas.clientWidth, canvas.clientHeight, false );
    
})

// 7 Controls

CameraControls.install( { THREE: subsetOfTHREE } );
const clock = new Clock();
const cameraControls = new CameraControls( camera, canvas );
cameraControls.dollyToCursor = true;


// 8 Animation

function animate() {
    const delta = clock.getDelta();
    cameraControls.update( delta );

    sun.rotation.y += 0.01;
    earth.rotation.y += 0.03;

    renderer.render( scene, camera );
    requestAnimationFrame( animate );
}
animate();