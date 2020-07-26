<template>
<div></div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import * as THREE from './build/three.module.js';
import { OrbitControls } from './utils/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './utils/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './utils/jsm/loaders/DRACOLoader.js';
import { BasisTextureLoader } from './utils/jsm/loaders/BasisTextureLoader.js';

export default {
  name: 'App',
  components: {
    HelloWorld,
  },
  methods: {
    app() {
      let camera, scene, renderer, controls, textureCube;

      const init = () => {
        //环境初始化
        camera = new THREE.PerspectiveCamera(
          40,
          window.innerWidth / window.innerHeight,
          1,
          1000
        );
        camera.position.set(5, 2, 8);
        scene = new THREE.Scene();

        //添加灯光
        initLight();

        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.gammaOutput = true;
        renderer.gammaFactor = 2.2;

        var r = './assets/texture/env5/';
        var urls = [
          r + 'px.png',
          r + 'nx.png',
          r + 'py.png',
          r + 'ny.png',
          r + 'pz.png',
          r + 'nz.png',
        ];

        textureCube = new THREE.CubeTextureLoader().load(urls);
        textureCube.format = THREE.RGBFormat;
        textureCube.mapping = THREE.CubeReflectionMapping;
        textureCube.encoding = THREE.sRGBEncoding;
        // textureCube.flipY = true;
        // textureCube.wrapS = THREE.RepeatWrapping;
        // textureCube.repeat.x = - 1;

        // renderer.physicallyCorrectLights = true

        //加载贴图和添加模型
        loadBasisTex(initModel, 3);

        //添加旋转控制器
        controls = new OrbitControls(camera, renderer.domElement);
        controls.rotateSpeed = 0.4;
        controls.addEventListener('change', () =>
          renderer.render(scene, camera)
        );

        document.body.appendChild(renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
      };

      //初始化灯光
      const initLight = () => {
        //环境光
        let ambientLight = new THREE.AmbientLight(0xffffff);
        ambientLight.intensity = 0.3;
        scene.add(ambientLight);

        let PointLight = new THREE.PointLight(0xffffff);
        PointLight.position.set(60, 40, 40);
        PointLight.castShadow = true;
        PointLight.intensity = 1;
        scene.add(PointLight);
      };

      //加载模型
      const initModel = (map, metalMap, normalMap, roughMap, num) => {
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        // 设置解码器路径
        dracoLoader.setDecoderPath('./utils/libs/draco/gltf/');
        gltfLoader.setDRACOLoader(dracoLoader);

        gltfLoader.load(`./assets/models/tance/${num}-processed.glb`, function (
          gltf
        ) {
          let wrapper = new THREE.Object3D();
          let children = [];
          gltf.scene.traverse(function (child) {
            if (child.isMesh) {
              console.log(child);

              child.position.set(0, 0, 0);
              child.material = new THREE.MeshStandardMaterial({
                map: map,
                metalnessMap: metalMap,
                roughnessMap: roughMap,
                normalMap: normalMap,
                roughness: 1,
                metalness: 1,
                envMap: textureCube,
                envMapIntensity: 1,
                transparent: true,
              });

              children.push(child);
            }
          });
          for (let i = 0; i < children.length; i++) {
            wrapper.add(children[i]);
          }
          wrapper.position.set(0, -1.5, 0);
          wrapper.scale.set(2, 2, 2);
          console.log(wrapper);
          scene.add(wrapper);

          renderer.render(scene, camera);
        });
      };

      const loadBasisTex = (callback, num) => {
        const basisLoader = new BasisTextureLoader();
        basisLoader.setTranscoderPath('./utils/libs/basis/');
        basisLoader.detectSupport(renderer);
        Promise.all([
          new Promise((resolve, reject) =>
            basisLoader.load(
              `./assets/models/tance/basis/basecolor_${num}.basis`,
              resolve,
              undefined,
              reject
            )
          ),
          new Promise((resolve, reject) =>
            basisLoader.load(
              `./assets/models/tance/basis/metallic_${num}.basis`,
              resolve,
              undefined,
              reject
            )
          ),
          new Promise((resolve, reject) =>
            basisLoader.load(
              `./assets/models/tance/basis/normal_${num}.basis`,
              resolve,
              undefined,
              reject
            )
          ),
          new Promise((resolve, reject) =>
            basisLoader.load(
              `./assets/models/tance/basis/Roughness_${num}.basis`,
              resolve,
              undefined,
              reject
            )
          ),
        ]).then(([map, metalMap, normalMap, roughMap]) => {
          map.encoding = THREE.sRGBEncoding;
          map.flipY = false;
          metalMap.flipY = false;
          normalMap.flipY = false;
          roughMap.flipY = false;
          callback(map, metalMap, normalMap, roughMap, num);
        });
      };

      //响应式
      const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
      };

      //render渲染内容
      init();
    }
  },
  mounted() {
    //项目初始化
    this.app();
  },
};
</script>
