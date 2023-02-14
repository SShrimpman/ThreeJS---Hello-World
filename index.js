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

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


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

const material = new MeshLambertMaterial({ color: 'orange' });
const geometry = new BoxGeometry();
const cubeMesh = new Mesh(geometry, material);
scene.add(cubeMesh);

const cubeMesh2 = new Mesh(geometry, material);
cubeMesh2.position.x += 2;
scene.add(cubeMesh2);

const cubes = [cubeMesh, cubeMesh2];

// const loader = new GLTFLoader();

// const loadingScreen = document.getElementById('loader-container');

// const progressText = document.getElementById('progress-text');

// loader.load('./police_station.glb',

//     (gltf) => {
//         scene.add(gltf.scene);
//         loadingScreen.classList.add('hidden');
//     },

//     (progress) => {
//         console.log(progress);
//         const progressPercent = progress.loaded / progress.total * 100;
//         const formatted = Math.trunc(progressPercent);
//         progressText.textContent = `Loading: ${formatted}%`;
//     },

//     (error) => {
//         console.log(error);
//     }

// );


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

cameraControls.setLookAt( 3, 4, 2, 0, 0, 0);

// 8 Picking

const raycaster = new Raycaster();
const mouse = new Vector2();
const previousSelection = {
    geometry: null,
    material: null
}

const highlightMat = new MeshBasicMaterial({ color: 'red' });

window.addEventListener('mousemove', (event) => {
    
    getMousePosition(event);

    raycaster.setFromCamera( mouse, camera );
    const intersections = raycaster.intersectObjects(cubes);

    if (hasNoCollisions(intersections)) {
        restorePreviousSelection();
        return;
    };
    const foundItem = intersections[0];

    
    if (isPreviousSelection(foundItem)) return;

    restorePreviousSelection();
    savePreviousSelection(foundItem);
    highlightItem(foundItem);
})

function getMousePosition(event){
    mouse.x = event.clientX / canvas.clientWidth * 2 - 1;
    mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1;
}

function hasNoCollisions(intersections){
    return intersections.length === 0;
}

function highlightItem(item){
    item.object.material = highlightMat;
}

function isPreviousSelection(item){
    return isPreviousSelection.mesh === item.object;
}

function savePreviousSelection(item) {
    previousSelection.mesh = item.object;
    previousSelection.material = item.object.material;
}

function restorePreviousSelection() {
    if(previousSelection.mesh) {
        previousSelection.mesh.material = previousSelection.material;
        previousSelection.mesh = null;
        previousSelection.material = null;
    }

}

// 9 Animation

function animate() {
    const delta = clock.getDelta();
    cameraControls.update( delta );

    // sun.rotation.y += 0.01;
    // earth.rotation.y += 0.03;

    renderer.render( scene, camera );
    requestAnimationFrame( animate );
}
animate();

// 10 GUI

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