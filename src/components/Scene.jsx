import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import ReactSlider from "react-slider";
import BuildingDetail from "./BuildingDetail";
import { TypeAnimation } from "react-type-animation";

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
    this.ambiantIntensity = 0.2;
    this.objects = [];
    this.detail = false;
    this.detail_object = {};
    this.renderer = new THREE.WebGLRenderer();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.visit = false;
  }

  componentDidMount() {
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    // Trigger an element callback to move the camera
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
        if (event.target && event.target.id === "visit") {
          this.vist = !this.visit;
        } else {
          if (intersects.length > 0 && !this.visit) {
            this.detail = true;
            intersects[0].object.parent.callback();
          }
        }
      }
    };
    // SpotLight follow mouse event
    const onMouseMove = (event) => {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(this.camera);
      var dir = vector.sub(this.camera.position).normalize();
      var distance = -this.camera.position.z / dir.z;
      var pos = this.camera.position.clone().add(dir.multiplyScalar(distance));

      if (!this.visit) {
        this.light_x = pos.x;
        this.light_y = pos.y;
        this.light_z = pos.z;
      }
    };

    const addStars = () => {
      const star = new THREE.Mesh(
        new THREE.SphereGeometry(0.2),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      for (let i = 0; i < 500; i += 1) {
        let tmp_star = star.clone();
        tmp_star.position.set(
          Math.random() * (150 - -200) + -200,
          Math.random() * (150 - -200) + -200,
          Math.random() * (150 - -200) + -200
        );
        this.scene.add(tmp_star);
      }
    };
    const loadObjects = () => {
      const hq_material = new THREE.MeshStandardMaterial();
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
        hq_material.map = texture;
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
      new OBJLoader().setPath("./assets/models/").load(
        "HeadQuarter.obj",
        (object) => {
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = hq_material;
              child.castShadow = true;
            }
          });
          object.position.set(12, 0, 0);
          object.scale.set(1.5, 1.5, 1.5);
          object.name = "HQ";
          object.callback = this.HQCallback;
          object.castShadow = true;
          object.receiveShadow = true;
          this.scene.add(object);
          this.objects.push(object);
          this.loading += 25;
          this.forceUpdate();
        },
        undefined,
        (err) => console.error(err)
      );
      new OBJLoader().setPath("./assets/models/").load(
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
      new OBJLoader().setPath("./assets/models/").load(
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
      new OBJLoader().setPath("./assets/models/").load(
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
          this.loading += 5;
          this.forceUpdate();
        },
        undefined,
        (err) => console.error(err)
      );
      new OBJLoader().setPath("./assets/models/").load(
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
          this.loading += 5;
          this.forceUpdate();
        },
        undefined,
        (err) => console.error(err)
      );
      new OBJLoader().setPath("./assets/models/").load(
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
          this.loading += 5;
          this.forceUpdate();
        },
        undefined,
        (err) => console.error(err)
      );
      new OBJLoader().setPath("./assets/models/").load(
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
          this.loading += 5;
          this.forceUpdate();
        },
        undefined,
        (err) => console.error(err)
      );
      new OBJLoader().setPath("./assets/models/").load(
        "Hotel Client.obj",
        (object) => {
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = client_material;
              child.castShadow = true;
            }
          });
          object.position.set(-9.3, 2.4, 5);
          object.scale.set(0.2, 0.2, 0.2);
          object.name = "Hotel Client";
          object.castShadow = true;
          this.scene.add(object);
          this.objects.push(object);
          this.loading += 5;
          this.forceUpdate();
        },
        undefined,
        (err) => console.error(err)
      );
      new OBJLoader().setPath("./assets/models/").load(
        "Bellhop.obj",
        (object) => {
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = bellhop_material;
              child.castShadow = true;
            }
          });
          object.position.set(-10, 2.4, 5);
          object.scale.set(0.2, 0.2, 0.2);
          object.name = "Bellhop";
          object.castShadow = true;
          this.scene.add(object);
          this.objects.push(object);
          this.loading += 5;
          this.forceUpdate();
        },
        undefined,
        (err) => console.error(err)
      );
    };
    const initLights = () => {
      this.light_x = 0;
      this.light_y = 50;
      this.light_z = 0;
      this.ambiant = new THREE.AmbientLight(0xdff9fb, this.ambiantIntensity);
      this.scene.add(this.ambiant);

      this.spotLight = new THREE.SpotLight(0xf7d794, 0.9);
      this.spotLight.position.set(this.light_x, this.light_y, this.light_z);
      this.spotLight.angle = Math.PI / 12;
      this.spotTarget = new THREE.Object3D();
      this.spotLight.castShadow = true;
      this.scene.add(this.spotLight, this.spotTarget);
      this.spotLight.target = this.spotTarget;
      this.spotTarget.position.set(20, 20, 20);

      this.spotLight2 = new THREE.SpotLight(0xf7d794, 0);
      this.spotLight2.position.set(-8.5, 4, 10);
      this.spotLight2.angle = Math.PI / 12;
      this.spotTarget2 = new THREE.Object3D();
      this.scene.add(this.spotLight2, this.spotTarget2);
      this.spotLight2.target = this.spotTarget2;
      this.spotTarget2.position.set(-9, 3.2, 5);

      this.spotLight3 = new THREE.SpotLight(0xf7d794, 0);
      this.spotLight3.position.set(12.5, 4, 12.5);
      this.spotLight3.angle = Math.PI / 12;
      this.spotTarget3 = new THREE.Object3D();
      this.scene.add(this.spotLight3, this.spotTarget3);
      this.spotLight3.target = this.spotTarget3;
      this.spotTarget3.position.set(12, 3.3, 7);

      this.spotLight4 = new THREE.SpotLight(0xf7d794, 0);
      this.spotLight4.position.set(26.5, 4, 15.5);
      this.spotLight4.angle = Math.PI / 12;
      this.spotTarget4 = new THREE.Object3D();
      this.scene.add(this.spotLight4, this.spotTarget4);
      this.spotLight4.target = this.spotTarget4;
      this.spotTarget4.position.set(26.5, 3, 8.5);
    };
    const generatePlane = () => {
      const geometry2 = new THREE.PlaneGeometry(55, 20);
      const planeMaterial = new THREE.MeshPhysicalMaterial({ color: 0x95a5a6 });
      geometry2.rotateX(-Math.PI * 0.5);
      const plane = new THREE.Mesh(geometry2, planeMaterial);
      plane.position.set(7, 0, 0);
      plane.receiveShadow = true;
      this.scene.add(plane);
    };

    var init = () => {
      this.scene.background = new THREE.Color("#000000");
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.camera.position.lerp(this.camera_position, 0.05);
      this.controls.target.set(12, 0, 0);

      window.addEventListener("click", onDocumentMouseDown, false);
      document.addEventListener("mousemove", onMouseMove, false);

      loadObjects();
      generatePlane();
      initLights();
      addStars();
    };
    var animate = () => {
      requestAnimationFrame(animate);
      if (!this.visit) {
        this.camera.position.lerp(this.camera_position, 0.1);
      }
      this.controls.update();
      this.ambiant.intensity = this.ambiantIntensity;
      this.spotTarget.position.set(this.light_x, this.light_y, this.light_z);

      this.renderer.render(this.scene, this.camera);
    };

    init();
    animate();
  }
  //#region Callbacks
  resetCamera = () => {
    this.detail_object = {
      name: "",
    };
    this.detail = false;
    this.controls.target.set(12, 0, 0);
    this.ambiant.intensity = 0.2;
    this.spotLight.intensity = 0.9;
    this.spotLight2.intensity = 0;
    this.spotLight3.intensity = 0;
    this.spotLight4.intensity = 0;
    this.camera_position.copy(new THREE.Vector3(12, 50, 50));
    this.forceUpdate();
  };
  HQCallback = () => {
    this.detail_object = {
      name: "Headquarter",
      description: "Heaquarter is the emblematic building of Elrond City",
      collection: "Genesis",
      supply: "150",
      jobs: ["Trader", "CEO"],
    };
    this.controls.target.set(12, 3.3, 7);
    this.forceUpdate();
    this.spotLight3.intensity = 0.9;
    this.spotLight.intensity = 0;
    this.camera_position.copy(new THREE.Vector3(11, 3, 8.8));
  };
  HotelCallback = () => {
    this.detail_object = {
      name: "Hotel",
      description: "The Hotel welcome the most valuable client of Elrond City",
      collection: "Genesis",
      supply: "150",
      jobs: ["Bellhop", "Hotel client"],
    };
    this.controls.target.set(-9.3, 3.5, 5);
    this.spotLight2.intensity = 0.9;
    this.spotLight.intensity = 0;
    this.camera_position.copy(new THREE.Vector3(-10, 2.91, 6.5));
    this.forceUpdate();
  };
  RestaurantCallback = () => {
    this.detail_object = {
      name: "Restaurant",
      description: "The Restaurant serves the greatest meals of Elrond City",
      collection: "Expansion",
      supply: "500",
      jobs: ["Cook", "Chef"],
    };
    this.controls.target.set(26.5, 3.2, 8.5);
    this.spotLight4.intensity = 0.9;
    this.spotLight.intensity = 0;
    this.camera_position.copy(new THREE.Vector3(27, 2.6, 10));
    this.forceUpdate();
  };
  //#endregion
  render() {
    return (
      <div>
        {this.loading < 140 ? (
          <div className="backdrop">
            <h1>Loading Experience...</h1>
            <div className="loading"></div>
          </div>
        ) : null}
        {this.detail && !this.visit && (
          <button
            id={"close"}
            className="button_close"
            onClick={this.resetCamera}
          >
            <img src="./assets/close.png" width={10} height={10} alt="close" />
          </button>
        )}
        <button
          id="visit"
          className={"explore_button " + (this.visit ? "green" : "red")}
          onClick={() => {
            this.visit = !this.visit;
            this.forceUpdate();
          }}
        >
          {"FREE CAMERA " + (this.visit ? "ON" : "OFF")}
        </button>
        {this.detail && this.detail_object.name !== "" && (
          <BuildingDetail object={this.detail_object} />
        )}
        <div className="gui">
          <h2>Controls</h2>
          <h3>Ambiant Light</h3>
          <p>Intensity</p>
          <ReactSlider
            className="customSlider"
            thumbClassName="customSlider-thumb"
            trackClassName="customSlider-track"
            markClassName="customSlider-mark"
            marks={0.1}
            min={0}
            max={7}
            onChange={(value) => (this.ambiantIntensity = value / 10)}
          />
          <div className="separator" />
        </div>
        {!this.detail && (
          <TypeAnimation
            sequence={[
              "Welcome to Elrond City.",
              500,
              "Click on a building to discover it.",
              1500,
              "Enjoy discovering.",
              () => {},
            ]}
            wrapper="div"
            cursor={true}
            style={{
              position: "absolute",
              top: "25px",
              left: "25px",
              color: "hsl(230, 100%, 95%)",
              textShadow:
                "0 0 1em hsla(320, 100%, 50%, 0.5),0 0 0.125em hsla(320, 100%, 90%, 0.5),-0.25em -0.125em 0.125em hsla(40, 100%, 60%, 0.2),0.25em 0.125em 0.125em hsla(200, 100%, 60%, 0.4)",
              fontSize: "2.5rem",
              fontFamily: "Poppins",
            }}
          />
        )}
      </div>
    );
  }
}
