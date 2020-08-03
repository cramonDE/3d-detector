<template>
  <div class="container">
    <template v-if="!isStarted">
      <div class="start-bg" id="startBg">
        <button class="start" id="btnStart"></button>
      </div>
      <div class="main">
        <div class="main-bg"></div>
        <div id="tag" class="tag1"></div>
        <div class="btn-left" id="btnLeft"></div>
        <div class="btn-right" id="btnRight"></div>
        <div class="swipe" id="swipe"></div>
        <button class="confirm" id="btnConfirm" style="visibility: hidden;"></button>
      </div>
    </template>
    <Game v-else />    
  </div>
</template>

<script>
import Game from './components/Game.vue';
import * as THREE from './build/three.module.js';
import { OrbitControls } from './utils/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './utils/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './utils/jsm/loaders/DRACOLoader.js';
import { BasisTextureLoader } from './utils/jsm/loaders/BasisTextureLoader.js';

export default {
  name: 'App',
  components: {
    Game,
  },
  data() {
    return {
      isStarted: false
    }
  },
  methods: {
    app() {
      let camera, scene, renderer, controls, textureCube;
      let wrapper = [];
      let wrapperX = [-3.5, -0, 3.5];
      let rotateControl = [false, false, false]
		  let tweenControl = []
      let rotate = 0;
      let curIndex = 0;
      let clickAni = false;
      let startX, startY, moveEndX, moveEndY;
      const btnLeft = document.querySelector('#btnLeft');
      const btnRight = document.querySelector('#btnRight');
      const btnStart = document.querySelector('#btnStart');
      const btnConfirm = document.querySelector('#btnConfirm');
      const tag = document.querySelector('#tag')
      const swipe = document.querySelector('#swipe');
      const cameraToleft = () => {
        if(clickAni) {
          return
        }
        clickAni = true
        let x = 0
        renderer.render( scene, camera)
        switch(curIndex) {
          case 0:
            x = -3.5
            break
          case 1:
            x = -3.5
            break
          case 2:
            x = 0
            break
          default: 
            break
        }
        if(curIndex > 0){
          curIndex --
        }
        tag.className = 'tag' + (curIndex + 1)
        camera.layers.enable( curIndex + 1 );
        TweenMax.to(
          camera.position,
          0.35,
          {
            x: x,
            ease:Power0.easeNone,
            onComplete: function(){
              clickAni = false
              // self.enter_ani = false;
              // self.object.rotation.y = 0;
              // this.playani = false;
            }
          }
        );
      }

      const cameraToright = () => {
        if(clickAni) {
          return
        }
        renderer.render( scene, camera)
        clickAni = true
        let x = 0
        switch(curIndex) {
          case 0:
            x = 0
            break
          case 1:
            x = 3.5
            break
          case 2:
            x = 3.5
            break
          default: 
            break
        }
        if(curIndex < 2){
          curIndex ++
          camera.layers.enable( curIndex + 1 );
        }
        tag.className = 'tag' + (curIndex + 1)
        TweenMax.to(
          camera.position,
          0.35,
          {
            x: x,
            ease:Power0.easeNone,
            onComplete: function(){
              // self.enter_ani = false;
              // self.object.rotation.y = 0;
              // this.playani = false;
              clickAni = false
            }
          }
        );
      }
      btnLeft.addEventListener('click', cameraToleft)
      btnRight.addEventListener('click', cameraToright)
      btnStart.addEventListener('click', () => {
        const startBg = document.querySelector('#startBg');
        startBg.setAttribute('style', 'display:none');
        setTimeout(() => {
          btnConfirm.setAttribute('style', 'visibility: visible');
        }, 600);
      });

      btnConfirm.addEventListener('click', () => {
        btnConfirm.setAttribute('style', 'display:none');
        rotateControl[curIndex] = false
        TweenMax.to(wrapper[curIndex].rotation, 0.5, {
          x: -0.4,
          z: -2.1,
          y: -1.55,
          ease: Power0.easeOut,
          onComplete: function () {},
        });
        TweenMax.to(wrapper[curIndex].position, 0.5, {
          x: wrapperX[curIndex],
          z: 5,
          y: -1,
          ease: Power0.easeOut,
          onComplete: () => {
            clickAni = true;
            // 跳转链接 to do 传参 curIndex
            setTimeout(() => {
              this.isStarted = true;
            }, 1000)
          },
        });
      });
      swipe.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.startX = e.changedTouches[0].pageX;
        this.startY = e.changedTouches[0].pageY;
      });
      swipe.addEventListener('touchmove', (e) => {
        e.preventDefault();
        this.moveEndX = e.changedTouches[0].pageX;
        this.moveEndY = e.changedTouches[0].pageY;
        let X = this.moveEndX - this.startX;
        let Y = this.moveEndY - this.startY;
        if (X > 100 && Math.abs(Y) < 20) {
          btnLeft.click()
        } else if (X < -100 && Math.abs(Y) < 20) {
          btnRight.click()
        } else if ( Math.abs(Y) < 30){
          tweenControl[curIndex].kill()
          rotateControl[curIndex] = true
        }
      });
      const init = () => {
        //环境初始化
        camera = new THREE.PerspectiveCamera(
          40,
          window.innerWidth / window.innerHeight,
          1,
          1000
        );
        camera.position.set( -3.5, 0, 8 );
        scene = new THREE.Scene()
        camera.layers.enable( 1 );

        //添加灯光
        initLight();

        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
        });
        renderer.setPixelRatio(2);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.gammaOutput = true;
        renderer.gammaFactor = 2.2;

        var r = './assets/texture/env5/';
        var urls = [
          r + 'px.jpg',
          r + 'nx.jpg',
          r + 'py.jpg',
          r + 'ny.jpg',
          r + 'pz.jpg',
          r + 'nz.jpg',
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
        loadBasisTex(initModel, 1, {
          x: -3.6,
          y: -0.8,
          z: 0,
          scale: 1.2,
        });
        setTimeout(() => {
          loadBasisTex(initModel, 2, {
            x: -0.3,
            y: -0.8,
            z: 0,
            scale: 0.6
          })
          loadBasisTex(initModel, 3, {
            x: 3.4,
            y: -0.8,
            z: 0,
            scale: 1.5
          })
        }, 100)

        //添加旋转控制器
        // controls = new OrbitControls( camera, renderer.domElement )
        // controls.rotateSpeed = .4
        // controls.addEventListener( 'change', () => renderer.render( scene, camera ) )

        document.body.appendChild(renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
      };

      //初始化灯光
      const initLight = () => {
        //环境光
        let ambientLight = new THREE.AmbientLight(0xffffff);
        ambientLight.intensity = 1;
        scene.add(ambientLight);

        let PointLight = new THREE.PointLight(0xffffff);
        PointLight.position.set(0, 2, 4);
        PointLight.castShadow = true;
        PointLight.intensity = 1;
        scene.add(PointLight);
      };

      //加载模型
      const initModel = (map, metalMap, normalMap, num, size) => {
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        // 设置解码器路径
        dracoLoader.setDecoderPath('./utils/libs/draco/gltf/');
        gltfLoader.setDRACOLoader(dracoLoader);

        gltfLoader.load(`./assets/models/tance/${num}-processed.glb`, function (
          gltf
        ) {
          let index = num - 1;
          wrapper[index] = new THREE.Object3D();
          let children = [];
          gltf.scene.traverse(function (child) {
            if (child.isMesh) {
              console.log(child);

              child.position.set(0, 0, 0);
              child.material = new THREE.MeshStandardMaterial({
                map: map,
                metalnessMap: metalMap,
                // roughnessMap: roughMap,
                normalMap: normalMap,
                roughness: 0.5,
                metalness: 1,
                envMap: textureCube,
                envMapIntensity: 1,
                transparent: true,
              });
              child.layers.set(num)

              children.push(child);
            }
          });
          for (let i = 0; i < children.length; i++) {
            wrapper[index].add(children[i]);
          }
          wrapper[index].position.set(size.x, size.y, size.z);
          wrapper[index].rotation.x = 0.9;
          wrapper[index].rotation.z = -0.2;
          wrapper[index].scale.set(size.scale, size.scale, size.scale);
          tweenControl[index] = new TweenMax(wrapper[index].rotation, 2, {
            z: 0,
            x: 1.1,
            y: 0.2,
            repeat: -1,
            yoyo: true,
          });
          scene.add(wrapper[index]);

          renderer.render(scene, camera);

          animate();
        });
      };

      const loadBasisTex = (callback, num, size) => {
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
          // new Promise((resolve, reject) =>
          //   basisLoader.load(
          //     `./assets/models/tance/basis/Roughness_${num}.basis`,
          //     resolve,
          //     undefined,
          //     reject
          //   )
          // ),
        ]).then(([map, metalMap, normalMap]) => {
          map.encoding = THREE.sRGBEncoding;
          map.flipY = false;
          metalMap.flipY = false;
          normalMap.flipY = false;
          // roughMap.flipY = false;
          callback(map, metalMap, normalMap, num, size);
        });
      };

      //响应式
      const onWindowResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
      };

      const animate = () => {
        for(let i = 0; i < 3; i ++){
          if(rotateControl[i]){
            let rotation = (startY - moveEndY) / 15
            if(Math.abs(rotation) < 1 && !clickAni) {
              wrapper[i].rotation.y = (startY - moveEndY) / 15
            }
          }
        }
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      //render渲染内容
      init();
    },
  },
  mounted() {
    //项目初始化
    this.app();
  },
};
</script>
