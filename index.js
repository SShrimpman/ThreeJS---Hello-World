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

import { CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer.js';

import Stats from 'stats.js/src/Stats';


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



// const geometry = new BoxGeometry();
// const material = new MeshLambertMaterial({color: 'orange'});
// const mesh = new Mesh(geometry, material);
// scene.add(mesh);

// window.ondblclick = () => {
//     mesh.removeFromParent();
//     geometry.dispose();
//     material.dispose();
//     mesh.geometry = null;
//     mesh.material = null;
// }

// const loader = new GLTFLoader();

// const loadingScreen = document.getElementById('loader-container');
// const progressText = document.getElementById('progress-text');
// let policeStation;

// loader.load('./police_station.glb',

//     (gltf) => {
//         policeStation = gltf.scene;
//         scene.add(policeStation);
//         loadingScreen.classList.add('hidden');
//     },

//     (progress) => {
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

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.pointerEvents = 'none';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);


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
    labelRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    
})

// 7 Controls

CameraControls.install( { THREE: subsetOfTHREE } );
const clock = new Clock();
const cameraControls = new CameraControls( camera, canvas );
cameraControls.dollyToCursor = true;

cameraControls.setLookAt( 18, 20, 18, 0, 10, 0);

// 8 Picking

// const raycaster = new Raycaster();
// const mouse = new Vector2();

// window.addEventListener( 'dblclick', (event) => {
//     mouse.x = event.clientX / canvas.clientWidth * 2 - 1;
//     mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1;

//     raycaster.setFromCamera( mouse, camera );
//     const intersects = raycaster.intersectObject(policeStation);

//     if(!intersects.length) return;
    
//     const collisionLocation = intersects[0].point;

//     const message = window.prompt('Describe the issue:');

//     const container = document.createElement('div');
//     container.className = 'label-container';

//     const deleteButton = document.createElement('button');
//     deleteButton.textContent = 'X';
//     deleteButton.className = 'delete-button hidden';
//     container.appendChild(deleteButton);

//     const label = document.createElement('p');
//     label.textContent = message;
//     label.classList.add('label');
//     container.appendChild(label);


//     const labelObject = new CSS2DObject(container);
//     labelObject.position.copy(collisionLocation);
//     scene.add(labelObject);

//     deleteButton.onclick = () => {
//         labelObject.removeFromParent();
//         labelObject.element = null;
//         container.remove();
//     };

//     container.onmouseenter = () => deleteButton.classList.remove('hidden');
//     container.onmouseleave = () => deleteButton.classList.add('hidden');
// })


// 9 Animation

const stats = new Stats();
stats.showPanel(2);
document.body.appendChild(stats.dom);

function animate() {

    stats.begin();

    const delta = clock.getDelta();
    cameraControls.update( delta );

    // sun.rotation.y += 0.01;
    // earth.rotation.y += 0.03;

    renderer.render( scene, camera );
    labelRenderer.render(scene, camera);

    stats.end();

    requestAnimationFrame( animate );
}
animate();

// 10 GUI

// const gui = new GUI();
// const min = -3;
// const max = 3;
// const step = 0.01;

// const transformationFolder = gui.addFolder('Transformation');


// transformationFolder.add(box.position, 'y', min, max, step).name("Position Y");
// transformationFolder.add(box.position, 'x', min, max, step).name("Position X");
// transformationFolder.add(box.position, 'z', min, max, step).name("Position Z");

// gui.addFolder('Visibility').add(box, 'visible');

// const colorParam = {
//     value: 0xff0000
// }

// gui.addFolder('Colors').addColor(colorParam, 'value').name("Color").onChange(() => {
//     box.material.color.set(colorParam.value);
// });


// const functionParam = {
//     spin: () => {
//         gsap.to( box.rotation, { y: box.rotation.y + 10, duration: 1})
//     }
// }

// gui.addFolder('Animation').add(functionParam, 'spin').name("Spin");