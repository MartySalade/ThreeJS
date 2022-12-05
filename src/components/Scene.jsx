import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { SAOPass } from "three/addons/postprocessing/SAOPass.js";
import ReactSlider from "react-slider";
import BuildingDetail from "./BuildingDetail";

export default class Scene extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.camera_position = new THREE.Vector3(12, 50, 50);
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
    this.detail = false;
    this.detail_object = {};
    this.reset = false;
    this.renderer = new THREE.WebGLRenderer();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.light_x = 0;
    this.light_y = 50;
    this.light_z = 0;
    this.ambiant = new THREE.AmbientLight(0xffffff, 0.09);
    this.scene.add(this.ambiant);
  }

  componentDidMount() {
    // Triggered when an element is clicked on the scene
    const onDocumentMouseDown = (event) => {
      event.preventDefault();
      mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
      mouse.y =
        -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, this.camera);

      var intersects = raycaster.intersectObjects(this.objects, true);
      if (event.target && event.target.id === "close") {
        this.resetCamera();
      } else {
        if (intersects.length > 0) {
          this.detail = true;
          intersects[0].object.parent.callback();
        }
      }
    };

    // Follows the mouse event
    const onMouseMove = (event) => {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(this.camera);
      var dir = vector.sub(this.camera.position).normalize();
      var distance = -this.camera.position.z / dir.z;
      var pos = this.camera.position.clone().add(dir.multiplyScalar(distance));

      this.light_x = pos.x;
      this.light_y = pos.y;
      this.light_z = pos.z;
    };

    //#region SETUP
    this.scene.background = new THREE.Color("#000000");
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.camera.position.lerp(this.camera_position, 0.05);

    this.spotLight = new THREE.SpotLight(0xffffff, 0.9);
    this.spotLight.position.set(this.light_x, this.light_y, this.light_z);
    this.spotLight.angle = Math.PI / 12;
    this.spotTarget = new THREE.Object3D();
    this.scene.add(this.spotLight, this.spotTarget);
    this.spotLight.target = this.spotTarget;
    this.spotTarget.position.set(20, 20, 20);

    // const spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
    // this.scene.add(spotLightHelper);

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
    this.hq_material = new THREE.MeshStandardMaterial();
    const hotel_material = new THREE.MeshStandardMaterial();
    const restaurant_material = new THREE.MeshStandardMaterial();
    const cook_material = new THREE.MeshStandardMaterial();
    const chef_material = new THREE.MeshStandardMaterial();
    const trader_material = new THREE.MeshStandardMaterial();
    const ceo_material = new THREE.MeshStandardMaterial();
    const client_material = new THREE.MeshStandardMaterial();
    const bellhop_material = new THREE.MeshStandardMaterial();
    const texture_loader = new THREE.TextureLoader();
    texture_loader.load("./assets/textures/HeadQuarter.png", (texture) => {
      this.hq_material.map = texture;
    });
    texture_loader.load("./assets/textures/hotel.png", (texture) => {
      hotel_material.map = texture;
    });
    texture_loader.load("./assets/textures/Restaurant.png", (texture) => {
      restaurant_material.map = texture;
    });
    texture_loader.load("./assets/textures/Cook.png", (texture) => {
      cook_material.map = texture;
    });
    texture_loader.load("./assets/textures/chef.png", (texture) => {
      chef_material.map = texture;
    });
    texture_loader.load("./assets/textures/trader.png", (texture) => {
      trader_material.map = texture;
    });
    texture_loader.load("./assets/textures/Beniamin.png", (texture) => {
      ceo_material.map = texture;
    });
    texture_loader.load("./assets/textures/Bellhop.png", (texture) => {
      bellhop_material.map = texture;
    });
    texture_loader.load("./assets/textures/Hotel Client.png", (texture) => {
      client_material.map = texture;
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
                  child.material = this.hq_material;
                  child.castShadow = true;
                }
              });
              object.position.set(12, 0, 0);
              object.scale.set(1.5, 1.5, 1.5);
              object.name = "HQ";
              object.callback = this.HQCallback;
              object.castShadow = true;
              this.scene.add(object);
              this.objects.push(object);
              this.loading += 25;
              this.forceUpdate();
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
              object.position.set(-8, 0, 0);
              object.scale.set(1.5, 1.5, 1.5);
              object.castShadow = true;
              object.name = "Hotel";
              object.callback = this.HotelCallback;
              this.scene.add(object);
              this.objects.push(object);
              this.loading += 25;
              this.forceUpdate();
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
              object.position.set(27, 0, 4);
              object.scale.set(0.8, 0.8, 0.8);
              object.name = "Restaurant";
              object.callback = this.RestaurantCallback;
              object.castShadow = true;
              this.scene.add(object);
              this.objects.push(object);
              this.loading += 25;
              this.forceUpdate();
            },
            undefined,
            (err) => console.error(err)
          );
      });
    new MTLLoader()
      .setPath("./assets/models/textures/")
      .load("Cook.mtl", (materials) => {
        materials.preload();
        new OBJLoader()
          .setMaterials(materials)
          .setPath("./assets/models/")
          .load(
            "Cook.obj",
            (object) => {
              object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.material = cook_material;
                  child.castShadow = true;
                }
              });
              object.position.set(27, 1.7, 8.5);
              object.scale.set(0.2, 0.2, 0.2);
              object.name = "Cook";
              object.castShadow = true;
              this.scene.add(object);
              this.objects.push(object);
              this.loading += 12;
              this.forceUpdate();
            },
            undefined,
            (err) => console.error(err)
          );
      });
    new MTLLoader()
      .setPath("./assets/models/textures/")
      .load("chef.mtl", (materials) => {
        materials.preload();
        new OBJLoader()
          .setMaterials(materials)
          .setPath("./assets/models/")
          .load(
            "chef.obj",
            (object) => {
              object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.material = chef_material;
                  child.castShadow = true;
                }
              });
              object.position.set(26, 1.7, 8.5);
              object.scale.set(0.2, 0.2, 0.2);
              object.name = "Chef";
              object.castShadow = true;
              this.scene.add(object);
              this.objects.push(object);
              this.loading += 12;
              this.forceUpdate();
            },
            undefined,
            (err) => console.error(err)
          );
      });
    new MTLLoader()
      .setPath("./assets/models/textures/")
      .load("Beniamin.mtl", (materials) => {
        materials.preload();
        new OBJLoader()
          .setMaterials(materials)
          .setPath("./assets/models/")
          .load(
            "Beniamin.obj",
            (object) => {
              object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.material = ceo_material;
                  child.castShadow = true;
                }
              });
              object.position.set(12.5, 2.3, 7);
              object.scale.set(0.2, 0.2, 0.2);
              object.name = "CEO";
              object.castShadow = true;
              this.scene.add(object);
              this.objects.push(object);
              this.loading += 12;
              this.forceUpdate();
            },
            undefined,
            (err) => console.error(err)
          );
      });
    new MTLLoader()
      .setPath("./assets/models/textures/")
      .load("trader.mtl", (materials) => {
        materials.preload();
        new OBJLoader()
          .setMaterials(materials)
          .setPath("./assets/models/")
          .load(
            "trader.obj",
            (object) => {
              object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.material = trader_material;
                  child.castShadow = true;
                }
              });
              object.position.set(11.5, 2.3, 7);
              object.scale.set(0.2, 0.2, 0.2);
              object.name = "Trader";
              object.castShadow = true;
              this.scene.add(object);
              this.objects.push(object);
              this.loading += 12;
              this.forceUpdate();
            },
            undefined,
            (err) => console.error(err)
          );
      });
    new MTLLoader()
      .setPath("./assets/models/textures/")
      .load("Hotel Client.mtl", (materials) => {
        materials.preload();
        new OBJLoader()
          .setMaterials(materials)
          .setPath("./assets/models/")
          .load(
            "Hotel Client.obj",
            (object) => {
              object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.material = client_material;
                  child.castShadow = true;
                }
              });
              object.position.set(-10, 2.4, 5);
              object.scale.set(0.2, 0.2, 0.2);
              object.name = "Hotel Client";
              object.castShadow = true;
              this.scene.add(object);
              this.objects.push(object);
              this.loading += 12;
              this.forceUpdate();
            },
            undefined,
            (err) => console.error(err)
          );
      });
    new MTLLoader()
      .setPath("./assets/models/textures/")
      .load("Bellhop.mtl", (materials) => {
        materials.preload();
        new OBJLoader()
          .setMaterials(materials)
          .setPath("./assets/models/")
          .load(
            "Bellhop.obj",
            (object) => {
              object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.material = bellhop_material;
                  child.castShadow = true;
                }
              });
              object.position.set(-9.3, 2.4, 5);
              object.scale.set(0.2, 0.2, 0.2);
              object.name = "Bellhop";
              object.castShadow = true;
              this.scene.add(object);
              this.objects.push(object);
              this.loading += 12;
              this.forceUpdate();
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
    document.addEventListener("mousemove", onMouseMove, false);
    //#endregion

    // Main loop
    //#region
    var animate = () => {
      requestAnimationFrame(animate);
      this.camera.position.lerp(this.camera_position, 0.05);
      this.controls.update();
      this.scene.rotation.y = this.rotation;
      this.spotTarget.position.set(this.light_x, this.light_y, this.light_z);

      this.renderer.render(this.scene, this.camera);
    };
    //#endregion

    animate();
  }
  //#region Callbacks
  resetCamera = () => {
    this.detail_object = {
      name: "Elrond City",
    };
    this.controls.target.set(0, 0, 0);
    this.ambiant.intensity = 0.09;
    this.spotLight.intensity = 0.9;
    this.camera_position.copy(new THREE.Vector3(12, 50, 50));
    this.forceUpdate();
  };
  HQCallback = () => {
    this.detail_object = {
      name: "Heaquarter",
    };
    this.controls.target.set(12, 3.3, 7);
    this.forceUpdate();
    this.ambiant.intensity = 0.85;
    this.spotLight.intensity = 0;
    this.camera_position.copy(new THREE.Vector3(12, 3, 8.5));
  };
  HotelCallback = () => {
    this.detail_object = {
      name: "Hotel",
    };
    this.controls.target.set(-9.3, 3.5, 5);
    this.ambiant.intensity = 0.85;
    this.spotLight.intensity = 0;
    this.camera_position.copy(new THREE.Vector3(-10, 2.91, 6.5));
    this.forceUpdate();
  };
  RestaurantCallback = () => {
    this.detail_object = {
      name: "Restaurant",
    };
    this.controls.target.set(26.5, 3.2, 8.5);
    this.ambiant.intensity = 0.85;
    this.spotLight.intensity = 0;
    this.camera_position.copy(new THREE.Vector3(27, 3, 10));
    this.forceUpdate();
  };
  //#endregion
  componentWillUnmount() {}
  render() {
    return (
      <div>
        {this.loading < 100 ? (
          <div className="backdrop">
            <h1>Loading Scene...</h1>
            <div className="loading"></div>
          </div>
        ) : null}
        <button
          id={"close"}
          className="button_close"
          onClick={this.resetCamera}
        >
          X
        </button>
        {this.detail && <BuildingDetail object={this.detail_object} />}
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
          <p>Light x</p>
          <ReactSlider
            className="customSlider"
            thumbClassName="customSlider-thumb"
            trackClassName="customSlider-track"
            markClassName="customSlider-mark"
            marks={1}
            min={-100}
            max={100}
            onChange={(value) => (this.light_x = value)}
          />
          <div className="separator" />
          <p>Light y</p>
          <ReactSlider
            className="customSlider"
            thumbClassName="customSlider-thumb"
            trackClassName="customSlider-track"
            markClassName="customSlider-mark"
            marks={1}
            min={-100}
            max={100}
            onChange={(value) => (this.light_y = value)}
          />
          <div className="separator" />
          <p>Light z</p>
          <ReactSlider
            className="customSlider"
            thumbClassName="customSlider-thumb"
            trackClassName="customSlider-track"
            markClassName="customSlider-mark"
            marks={1}
            min={-100}
            max={100}
            onChange={(value) => (this.light_z = value)}
          />
          <div className="separator" />
        </div>
      </div>
    );
  }
}
