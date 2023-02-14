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
    SphereGeometry,
    AxesHelper,
    GridHelper,
    EdgesGeometry,
    LineBasicMaterial,
    LineSegments
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

import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

import gsap from 'gsap';

// 1 the Scene

const scene = new Scene();
const canvas = document.getElementById('three-canvas');

const axes = new AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 2
scene.add(axes);

const grid = new GridHelper();
grid.renderOrder = 1;
scene.add(grid);


// 2 the Object

const loader = new TextureLoader();

const geometry = new BoxGeometry( 2, 2, 2 );

const material = new MeshBasicMaterial({
    color: 'white',
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
});

const orangeMaterial = new MeshLambertMaterial( { color: 'orange' } );
// const blueMaterial = new MeshLambertMaterial( { color: 'blue' } );
// const whiteMaterial = new MeshLambertMaterial( { color: 'white' } );

const box = new Mesh( geometry, material );
scene.add( box );
box.position.x += 2;

const edgesGeo = new EdgesGeometry(geometry);
const edgesMaterial = new LineBasicMaterial({color: 0x000000});
const wireframe = new LineSegments(edgesGeo, edgesMaterial);
box.add( wireframe );

const cubeAxes = new AxesHelper( 0.5 );
cubeAxes.material.depthTest = false;
cubeAxes.renderOrder = 2
box.add(cubeAxes);


// const earth = new Mesh( geometry, blueMaterial );
// earth.scale.set( 0.2, 0.2, 0.2);
// earth.position.x += 2;
// sun.add( earth );


// const moon = new Mesh( geometry, whiteMaterial );
// moon.scale.set( 0.5, 0.5, 0.5);
// moon.position.x += 1;
// earth.add( moon );


// 3 the Camera

const camera = new PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight);
camera.position.z = 5;
camera.position.y = 6;
camera.position.x = 4;
camera.lookAt( axes.position );
scene.add(camera);

// 4 the Renderer

const renderer = new WebGLRenderer({ canvas });
renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );
renderer.setSize( canvas.clientWidth, canvas.clientHeight, false );
renderer.setClearColor(0x3E3E3E, 1);

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

    // sun.rotation.y += 0.01;
    // earth.rotation.y += 0.03;

    renderer.render( scene, camera );
    requestAnimationFrame( animate );
}
animate();

// 9 GUI

const gui = new GUI();
const min = -3;
const max = 3;
const step = 0.01;

const transformationFolder = gui.addFolder('Transformation');


transformationFolder.add(box.position, 'y', min, max, step).name("Position Y");
transformationFolder.add(box.position, 'x', min, max, step).name("Position X");
transformationFolder.add(box.position, 'z', min, max, step).name("Position Z");

gui.addFolder('Visibility').add(box, 'visible');

const colorParam = {
    value: 0xff0000
}

gui.addFolder('Colors').addColor(colorParam, 'value').name("Color").onChange(() => {
    box.material.color.set(colorParam.value);
});


const functionParam = {
    spin: () => {
        gsap.to( box.rotation, { y: box.rotation.y + 10, duration: 1})
    }
}

gui.addFolder('Animation').add(functionParam, 'spin').name("Spin");