import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import * as dat from "dat.gui";
export default class Scene extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.camera_position = new THREE.Vector3(50, 50, 50);
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.inZoom = false;
    this.initial = true;
    this.light_x = 30;
    this.light_y = 30;
    this.light_z = 30;
    this.distance = 100;
    this.angle = Math.PI / 20;
  }

  componentDidMount() {
    // Triggered when an element is clicked on the scene
    const onDocumentMouseDown = (event) => {
      event.preventDefault();
      mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, this.camera);

      var intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        // Call a specific function foreach building or citizen
        intersects[0].object.callback();

        this.inZoom = true;
        this.initial = false;
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
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    var controls = new OrbitControls(this.camera, renderer.domElement);
    var spotLight = new THREE.SpotLight(0xff0000);
    spotLight.distance = this.distance;
    spotLight.angle = this.angle;
    // scene.add(spotLight);
    // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    // scene.add(spotLightHelper);
    const directional_light = new THREE.DirectionalLight(0xffffff, 1);
    directional_light.position.set(-2, 4, 10);
    scene.add(directional_light);

    // controls.enableZoom = false;
    // controls.enableRotate = false;

    // ========== Mesh Creation ========== //
    var geometry = new THREE.BoxGeometry(10, 20, 10);
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    var cube = new THREE.Mesh(geometry, material);

    var geometry3 = new THREE.BoxGeometry(15, 30, 15);
    var material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    var cube2 = new THREE.Mesh(geometry3, material2);

    const park_material = new THREE.MeshStandardMaterial();
    const texture_loader = new THREE.TextureLoader();
    texture_loader.load("./assets/textures/park.png", (texture) => {
      // texture.wrapS = RepeatWrapping;
      // texture.wrapT = RepeatWrapping;
      park_material.map = texture;
    });

    new MTLLoader()
      .setPath("./assets/models/textures/")
      .load("park.mtl", function (materials) {
        materials.preload();
        new OBJLoader()
          .setMaterials(materials)
          .setPath("./assets/models/")
          .load(
            "park.obj",
            function (object) {
              object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.material = park_material;
                  child.castShadow = true;
                }
              });

              scene.add(object);
            },
            (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
            (err) => console.error(err)
          );
      });

    cube.callback = function () {
      // console.log("Building1");
    };
    cube2.callback = function () {
      // console.log("Building2");
    };

    cube.position.set(0, 10, 0);
    cube2.position.set(30, 15, 0);
    // scene.add(cube, cube2);
    this.camera.position.x = 50;
    this.camera.position.y = 50;
    this.camera.position.z = 50;

    const geometry2 = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshPhysicalMaterial({ color: 0x000000 });
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
      // Smooth move for the camera
      if (this.inZoom || this.initial) {
        // this.camera.position.lerp(this.camera_position, 0.05);
      }
      spotLight.position.set(this.light_x, this.light_y, this.light_z);
      controls.update();
      // scene.rotation.y += 0.001;
      renderer.render(scene, this.camera);
    };

    // const gui = new dat.GUI();
    // const lightFolder = gui.addFolder("Light");
    // lightFolder.add(this, "light_x", 0, 100, 1);
    // lightFolder.add(this, "light_y", 0, 100, 1);
    // lightFolder.add(this, "light_z", 0, 100, 1);
    // lightFolder.add(this, "angle", Math.PI / 8, Math.PI / 2, Math.PI / 8);
    // lightFolder.open();

    animate();
  }
  resetCamera = () => {
    this.inZoom = false;
    this.initial = true;
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
