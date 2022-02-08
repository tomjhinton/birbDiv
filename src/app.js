
import './style.scss'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { gsap } from 'gsap'
import * as Tone from 'tone'


import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const canvas = document.querySelector('canvas.webgl')



import Opening from './love.json'

const now = Tone.now()
const currentMidi = Opening
const synths = []
let notPlaying = true
// const freeverb = new Tone.Freeverb().toDestination()
// freeverb.dampening = 500
const vol = new Tone.Volume(-22).toDestination()
document.querySelector('#birb').addEventListener('click', (e) => {


  if (notPlaying && currentMidi) {
    notPlaying = false
    const now = Tone.now() + 0.5
    currentMidi.tracks.forEach((track) => {
      //create a synth for each track
      const synth = new Tone.PolySynth(Tone.Synth, {
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.3,
          release: 1
        }
      }).toDestination()
      console.log(synth)
      // synth.connect(freeverb)
      synth.connect(vol)
      synths.push(synth)
      //schedule all of the events
      track.notes.forEach((note) => {
        synth.triggerAttackRelease(
          note.name,
          note.duration,
          note.time + now,
          note.velocity
        )
      })
    })
  } else {
    //dispose the synth and make a new one
    while (synths.length) {
      const synth = synths.shift()
      synth.disconnect()
    }
    notPlaying = true
  }
})



const scene = new THREE.Scene()
const world = new CANNON.World()

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}



//Resizing handler

window.addEventListener('resize', () =>{



  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2 ))


})




/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, .1, 2000)
camera.position.x = -.0
camera.position.y = 0
camera.position.z = -4
scene.add(camera)




// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//Stops you looking under the model, because it's never polite to peak under someones model.
controls.maxPolarAngle = Math.PI / 2 - 0.1

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
})
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

renderer.domElement.addEventListener( 'pointerup', onClick, false )

const cutBlock = (width, height, depth, position) =>{



  const mesh = new THREE.Mesh(boxGeometry, material)
  mesh.castShadow = true
  mesh.position.copy(position)
  mesh.scale.set(width, height, depth)
  scene.add(mesh)

  //Cannon.js Body
  const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
  const body = new CANNON.Body({
    mass: 1,
    positon: new CANNON.Vec3(0, 0, 0),
    shape: shape,
    material: defaultMaterial
  })
  body.position.copy(position)


  world.addBody(body)

  objectsToUpdate.push({
    mesh: mesh,
    body: body
  })

}

document.querySelector('#gallery').addEventListener('click', (e) => {
  mesh.material = material

})


//Uses the raycaster to find the hidden mesh.

function onClick(event) {
  console.log(camera.position)
  event.preventDefault()
  let cuts = document.getElementById('cuts').value

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1

  raycaster.setFromCamera( mouse, camera )

  var intersects = raycaster.intersectObjects( intersectsArr, true )

  if ( intersects.length > 0 &&   mesh.material !== invisibleMaterial ) {

    splitBox(cuts)
  }



}

const invisibleMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0, depthWrite: false})

function splitBox(cuts){
  console.log(mesh.geometry)

  mesh.material = invisibleMaterial

  for(let i = 0; i < cuts; i ++){
    // if(i === 0){
    // cutBlock(mesh.scale.y /cuts, mesh.scale.y ,mesh.scale.y,
    //
    //   {x: (0 - (i/cuts)) ,y: 0,z: 0})
    // }
    // else if(i !== 0){

    // console.log((i/cuts) )
    // console.log('scale ' +mesh.scale.y /cuts)
    cutBlock(mesh.scale.y /cuts, mesh.scale.y ,mesh.scale.y,



      {x: (0 - ((1/cuts) * i) *.5)   ,y: 0,z: 0})
    console.log(0 - ((1/cuts) * i))
    // }
    //
    // } else if(i %2 !== 0){
    //   cutBlock(mesh.scale.y /cuts, mesh.scale.y ,mesh.scale.y,
    //     {x: (1 - (i/cuts)) ,y: 0,z: 0})
    // }

  }



  // mesh.scale.y *=.9

}


const objectsToUpdate = []

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent: true,
  depthWrite: true,
  clipShadows: true,
  wireframe: false,
  side: THREE.DoubleSide,
  uniforms: {
    uFrequency: {
      value: new THREE.Vector2(10, 5)
    },
    uTime: {
      value: 0
    },
    uValueA: {
      value: Math.random()
    },
    uValueB: {
      value: Math.random()
    },
    uValueC: {
      value: Math.random()
    },
    uValueD: {
      value: Math.random()
    },

    uMouse: {
      value: {x: 0.5, y: 0.5}
    },
    uResolution: { type: 'v2', value: new THREE.Vector2() },
    uPosition: {
      value: {
        x: 0
      }
    },
    uRotation: {
      value: 0



    }
  }
})


const mesh = new THREE.Mesh(boxGeometry, material)

scene.add(mesh)
const intersectsArr = []
intersectsArr.push(mesh)

//Physics

//World

world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, -2.82, 0)

//Materials
const defaultMaterial = new CANNON.Material('default')


const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.2,
    restitution: 0.7
  }
)

world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial


const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0),
  Math.PI * 0.5
)
floorBody.position.y = -9

world.addBody(floorBody)

window.addEventListener('resize', () =>{

  material.uniforms.uResolution.value.x = renderer.domElement.width
material.uniforms.uResolution.value.y = renderer.domElement.height

  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2 ))


})




//Animation stuff.

const clock = new THREE.Clock()
let oldElapsedTime = 0
const tick = () =>{
  // if ( mixer ) mixer.update( clock.getDelta() )

  if(material.uniforms.uResolution.value.x === 0 && material.uniforms.uResolution.value.y === 0 ){
  material.uniforms.uResolution.value.x = renderer.domElement.width
  material.uniforms.uResolution.value.y = renderer.domElement.height
}
  const elapsedTime = clock.getElapsedTime()
  material.uniforms.uTime.value = elapsedTime
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime
  //Update Physics World
  mesh.needsUpdate = true

  world.step(1/60, deltaTime, 3)

  for(const object of objectsToUpdate){
    object.mesh.position.copy(object.body.position)
    object.mesh.quaternion.copy(object.body.quaternion)
  }

  // Update controls
  controls.update()



  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
