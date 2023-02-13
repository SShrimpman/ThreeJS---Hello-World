import {
    Scene,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    PerspectiveCamera,
    WebGLRenderer
} from 'three';

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
const sizes = {
    width: 800,
    height: 600
}

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

// 6 Animation

function animate() {
    orangeCube.rotation.x += 0.01;
    orangeCube.rotation.z += 0.01;

    bigBlueCube.rotation.x -= 0.02;
    bigBlueCube.rotation.z -= 0.02;

    renderer.render( scene, camera );
    requestAnimationFrame( animate );
}

animate();