import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import ReactSlider from "react-slider";
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
    this.scene = new THREE.Scene();
    this.loading = 0;
    this.rotation = 0;
    this.objects = [];
  }

  componentDidMount() {
    // Triggered when an element is clicked on the scene
    const onDocumentMouseDown = (event) => {
      event.preventDefault();
      mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, this.camera);

      var intersects = raycaster.intersectObjects(this.objects, true);

      if (intersects.length > 0) {
        intersects[0].object.parent.callback();
      }
    };

    this.scene.background = new THREE.Color("#000000");
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    var controls = new OrbitControls(this.camera, renderer.domElement);

    //============ LIGHTS ============//
    //#region
    const directional_light = new THREE.AmbientLight(0xffffff, 0.4);
    directional_light.position.set(-2, 4, 10);
    this.scene.add(directional_light);
    //#endregion

    // Adding random stars
    //#region
    const star = new THREE.Mesh(
      new THREE.SphereGeometry(0.2),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    for (let i = 0; i < 1000; i += 1) {
      let tmp_star = star.clone();
      tmp_star.position.set(
        Math.random() * (150 - -200) + -200,
        Math.random() * (150 - -200) + -200,
        Math.random() * (150 - -200) + -200
      );
      this.scene.add(tmp_star);
    }
    //#endregion

    //============ LOAD TEXTURES AND OBJECTS ================//
    //#region
    const park_material = new THREE.MeshStandardMaterial();
    const hq_material = new THREE.MeshStandardMaterial();
    const hotel_material = new THREE.MeshStandardMaterial();
    const restaurant_material = new THREE.MeshStandardMaterial();
    const texture_loader = new THREE.TextureLoader();
    texture_loader.load("./assets/textures/park.png", (texture) => {
      park_material.map = texture;
    });
    texture_loader.load("./assets/textures/HeadQuarter.png", (texture) => {
      hq_material.map = texture;
    });
    texture_loader.load("./assets/textures/hotel.png", (texture) => {
      hotel_material.map = texture;
    });
    texture_loader.load("./assets/textures/Restaurant.png", (texture) => {
      restaurant_material.map = texture;
    });

    new MTLLoader()
      .setPath("./assets/models/textures/")
      .load("park.mtl", (materials) => {
        materials.preload();
        new OBJLoader()
          .setMaterials(materials)
          .setPath("./assets/models/")
          .load(
            "park.obj",
            (object) => {
              object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.material = park_material;
                  child.castShadow = true;
                }
              });
              object.position.set(-7, 0, 0);
              object.scale.set(0.6, 0.6, 0.6);
              object.name = "Park";
              object.callback = this.parkCallback;
              this.scene.add(object);
              this.objects.push(object);
              this.render();
            },
            undefined,
            (err) => console.error(err)
          );
      });
    new MTLLoader()
      .setPath("./assets/models/textures/")
      .load("HeadQuarter.mtl", (materials) => {
        materials.preload();
        new OBJLoader()
          .setMaterials(materials)
          .setPath("./assets/models/")
          .load(
            "HeadQuarter.obj",
            (object) => {
              object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.material = hq_material;
                  child.castShadow = true;
                }
              });
              object.position.set(9, 0, 0);
              object.name = "HQ";
              object.callback = this.HQCallback;
              this.scene.add(object);
              this.objects.push(object);
              this.loading += 25;
              this.render();
            },
            undefined,
            (err) => console.error(err)
          );
      });
    new MTLLoader()
      .setPath("./assets/models/textures/")
      .load("hotel.mtl", (materials) => {
        materials.preload();
        new OBJLoader()
          .setMaterials(materials)
          .setPath("./assets/models/")
          .load(
            "hotel.obj",
            (object) => {
              object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.material = hotel_material;
                  child.castShadow = true;
                }
              });
              object.position.set(-26, 0, 0);
              object.scale.set(1.5, 1.5, 1.5);
              object.name = "Hotel";
              object.callback = this.HotelCallback;
              this.scene.add(object);
              this.objects.push(object);
              this.loading += 25;
              this.render();
            },
            undefined,
            (err) => console.error(err)
          );
      });
    new MTLLoader()
      .setPath("./assets/models/textures/")
      .load("Restaurant.mtl", (materials) => {
        materials.preload();
        new OBJLoader()
          .setMaterials(materials)
          .setPath("./assets/models/")
          .load(
            "Restaurant.obj",
            (object) => {
              object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.material = restaurant_material;
                  child.castShadow = true;
                }
              });
              object.position.set(24, 0, 0);
              object.name = "Restaurant";
              object.callback = this.RestaurantCallback;
              this.scene.add(object);
              this.objects.push(object);
              this.loading += 25;
              this.render();
            },
            undefined,
            (err) => console.error(err)
          );
      });
    //#endregion

    //=========== FLAT PLANE ============/
    //#region
    const geometry2 = new THREE.PlaneGeometry(80, 20);
    const planeMaterial = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee });
    geometry2.rotateX(-Math.PI * 0.5);
    const plane = new THREE.Mesh(geometry2, planeMaterial);
    plane.receiveShadow = true;
    this.scene.add(plane);
    //#endregion

    //======= CLICK LISTENER =======//
    //#region
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    window.addEventListener("click", onDocumentMouseDown, false);
    //#endregion

    // Main loop
    //#region
    var animate = () => {
      requestAnimationFrame(animate);
      this.camera.position.lerp(this.camera_position, 0.05);
      controls.update();
      this.scene.rotation.y = this.rotation;
      renderer.render(this.scene, this.camera);
    };
    //#endregion

    animate();
  }
  resetCamera = () => {
    console.log("Reset");
    this.camera_position.copy(new THREE.Vector3(50, 50, 50));
  };
  parkCallback = () => {
    console.log("Park Callback");
    this.camera_position.copy(new THREE.Vector3(17, 5, 10));
  };
  HQCallback = () => {
    console.log("HQ Callback");
  };
  HotelCallback = () => {
    console.log("Hotel Callback");
  };
  RestaurantCallback = () => {
    console.log("Restau Callback");
  };
  componentWillUnmount() {}
  render() {
    return (
      <div>
        {this.loading > 100 ? (
          <div className="backdrop">
            <h1>Loading Scene...</h1>
            <div className="loading"></div>
          </div>
        ) : null}
        <button className="button_close" onClick={this.resetCamera}>
          X
        </button>
        <div className="gui">
          <h2>Controls</h2>
          <h3>Scene</h3>
          <p>Rotation</p>
          <ReactSlider
            className="customSlider"
            thumbClassName="customSlider-thumb"
            trackClassName="customSlider-track"
            markClassName="customSlider-mark"
            marks={0.01}
            min={-1000}
            max={1000}
            onChange={(value) => (this.rotation = value / 100)}
          />
          <div className="separator" />
        </div>
      </div>
    );
  }
}
