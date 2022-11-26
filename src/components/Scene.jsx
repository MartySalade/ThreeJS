import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Scene extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.camera_position = new THREE.Vector3(50, 50, 50);
  }

  componentDidMount() {
    // Triggered when an element is clicked on the scene
    const onDocumentMouseDown = (event) => {
      event.preventDefault();
      mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      var intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        // Call a specific function foreach building or citizen
        intersects[0].object.callback();

        // Set the new position of the camera depeding on the object
        this.camera_position.copy(
          new THREE.Vector3(
            intersects[0].object.position.x + 20,
            intersects[0].object.position.y + 20,
            intersects[0].object.position.z + 20
          )
        );
      }
    };

    var scene = new THREE.Scene();
    scene.background = new THREE.Color("#130f40");
    var camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    var controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableZoom = false;
    // controls.enableRotate = false;

    // ========== Mesh Creation ========== //
    var geometry = new THREE.BoxGeometry(10, 20, 10);
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    var cube = new THREE.Mesh(geometry, material);

    var geometry3 = new THREE.BoxGeometry(15, 30, 15);
    var material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    var cube2 = new THREE.Mesh(geometry3, material2);

    cube.callback = function () {
      // console.log("Building1");
    };
    cube2.callback = function () {
      // console.log("Building2");
    };

    cube.position.set(0, 10, 0);
    cube2.position.set(30, 15, 0);
    scene.add(cube, cube2);
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;

    const geometry2 = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshPhysicalMaterial({ color: 0x130f40 });
    geometry2.rotateX(-Math.PI * 0.5);
    const plane = new THREE.Mesh(geometry2, planeMaterial);
    plane.receiveShadow = true;
    scene.add(plane);

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    window.addEventListener("click", onDocumentMouseDown, false);

    // Main loop
    var animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      // Smooth move for the camera
      camera.position.lerp(this.camera_position, 0.05);
      renderer.render(scene, camera);
    };

    //Reset camera

    animate();
  }
  resetCamera = () => {
    this.camera_position.copy(new THREE.Vector3(50, 50, 50));
  };
  componentWillUnmount() {}
  render() {
    return (
      <div>
        <button className="button_close" onClick={this.resetCamera}>
          X
        </button>
      </div>
    );
  }
}
