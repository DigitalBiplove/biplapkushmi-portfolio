// three-scene.js
import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.158.0/examples/jsm/controls/OrbitControls.js';

const container = document.getElementById('hero-3d');
if (container) {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isLowPower = navigator.connection?.saveData === true || (navigator.deviceMemory && navigator.deviceMemory <= 1);
  const ENABLE_ANIMATION = !reduceMotion && !isLowPower;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 20);
  camera.position.set(0, 0.25, 3.5);

  const ambient = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xffffff, 0.85);
  key.position.set(5, 4, 2);
  scene.add(key);

  const geometry = new THREE.IcosahedronGeometry(1.4, 3);
  const posAttr = geometry.attributes.position;
  const normalAttr = geometry.attributes.normal;
  const vertexCount = posAttr.count;
  const basePositions = new Float32Array(posAttr.array);
  const speeds = new Float32Array(vertexCount);
  const offsets = new Float32Array(vertexCount);
  for (let i = 0; i < vertexCount; i++) { speeds[i] = 0.6 + Math.random()*1.0; offsets[i]=Math.random()*Math.PI*2 }

  const colors = new Float32Array(vertexCount*3);
  const top = new THREE.Color(0x3b82f6);
  const bot = new THREE.Color(0x9be7ff);
  let minY=Infinity,maxY=-Infinity; for(let i=0;i<vertexCount;i++){const y=basePositions[i*3+1];if(y<minY)minY=y;if(y>maxY)maxY=y}
  const range=Math.max(maxY-minY,1e-6);
  for(let i=0;i<vertexCount;i++){const y=basePositions[i*3+1];const t=(y-minY)/range;const c=bot.clone().lerp(top,t);colors[i*3]=c.r;colors[i*3+1]=c.g;colors[i*3+2]=c.b}
  geometry.setAttribute('color', new THREE.BufferAttribute(colors,3,false));

  const material = new THREE.MeshStandardMaterial({vertexColors:true,metalness:0.55,roughness:0.28});
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping=true;controls.enablePan=false;controls.enableZoom=false;controls.maxPolarAngle=Math.PI/1.6;controls.minPolarAngle=Math.PI/4;controls.target.set(0,0.12,0);

  const targetRotation = {x:0,y:0};
  function onPointerMove(e){const rect=container.getBoundingClientRect();const cx=(e.clientX??(e.touches&&e.touches[0]?.clientX)??(rect.left+rect.width/2));const cy=(e.clientY??(e.touches&&e.touches[0]?.clientY)??(rect.top+rect.height/2));const x=(cx-rect.left)/rect.width;const y=(cy-rect.top)/rect.height;targetRotation.y=(x-0.5)*0.8;targetRotation.x=(y-0.5)*0.4}
  container.addEventListener('pointermove',onPointerMove,{passive:true});container.addEventListener('touchmove',(e)=>{if(e.touches&&e.touches[0])onPointerMove(e.touches[0])},{passive:true});

  const clock=new THREE.Clock(); function resize(){const w=Math.max(100,container.clientWidth);const h=Math.max(100,container.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()} const ro=new ResizeObserver(resize);ro.observe(container);resize();

  const positionArray=geometry.attributes.position.array;const normalArray=normalAttr.array;let stopped=false;function animate(){if(stopped)return;const t=clock.getElapsedTime();for(let i=0;i<vertexCount;i++){const ix=i*3;const n=(Math.sin(t*speeds[i]+offsets[i])*(ENABLE_ANIMATION?0.12:0.02));positionArray[ix]=basePositions[ix]+normalArray[ix]*n;positionArray[ix+1]=basePositions[ix+1]+normalArray[ix+1]*n;positionArray[ix+2]=basePositions[ix+2]+normalArray[ix+2]*n}geometry.attributes.position.needsUpdate=true;geometry.computeVertexNormals();mesh.rotation.x+=(targetRotation.x-mesh.rotation.x)*0.06;mesh.rotation.y+=(targetRotation.y-mesh.rotation.y)*0.06;mesh.rotation.y+=0.002;controls.update();renderer.render(scene,camera);requestAnimationFrame(animate)}
  animate();

  function webglAvailable(){try{const c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl')||c.getContext('experimental-webgl')))}catch(e){return false}}
  if(!webglAvailable()){renderer.domElement.remove();const f=document.createElement('div');f.className='hero-3d-fallback';f.innerHTML='<img src="/assets/img/profile-placeholder.svg" alt="Decorative visual">';container.appendChild(f)}

  container.__threeHeroCleanup=()=>{stopped=true;ro.disconnect();container.removeEventListener('pointermove',onPointerMove);container.innerHTML='';try{renderer.dispose()}catch(e){}try{geometry.dispose();material.dispose()}catch(e){}}

  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopped=true;else if(!stopped){stopped=false;clock.start();animate()}else{stopped=false;animate()}})
}
