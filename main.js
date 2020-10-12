(function(){

var fish = new Fish()
var swimPath = fish.swimPath([
  new THREE.Vector3(-17, 16, 90), //bl
  new THREE.Vector3(-20, 15, 98), //l
  new THREE.Vector3(-14, 13, 110), //fl
  new THREE.Vector3(0, 13, 113), //f
  new THREE.Vector3(16, 16, 110), //fr
  new THREE.Vector3(15, 21, 92), //r
  new THREE.Vector3(5, 20, 77), //br
  new THREE.Vector3(-7, 17, 79), //b
  new THREE.Vector3(-17, 16, 90),
])

var scene = new THREE.Scene()
// scene.background = new THREE.Color( 0x363129 )
// scene.background = new THREE.Color( 0x363129 )
var camera = new THREE.PerspectiveCamera(80, 320 / 150, .1, 250)
var renderer = new THREE.WebGLRenderer({ alpha: true })

renderer.shadowMapEnabled = true;

var up = new THREE.Vector3(0, 1, 0)
var axis = new THREE.Vector3()
var pt, radians, axis, tangent

var light = new THREE.DirectionalLight(0xffffff, .4)
light.position.set(20, 30, 130)
light.castShadow = true
light.shadowCameraNear = 20;
light.shadowCameraLeft = 50;
light.shadowCameraRight = -10;
light.shadowCameraTop = 100;
light.shadowCameraBottom = -20;
var lightTarget = new THREE.Object3D()
lightTarget.position.set(-55, 0, 100)
scene.add(lightTarget)
light.target = lightTarget

var ambLight = new THREE.AmbientLight( 0x404040, 2.2); // soft white light
scene.add( ambLight );

// var helper = new THREE.CameraHelper( light.shadow.camera );
// scene.add( helper );

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(320, 150)
document.querySelector('.goldfish').appendChild(renderer.domElement)

camera.position.x = -3
camera.position.y = 10
camera.position.z = 150

// Build Group
var fishObject = fish.getFish()
fishObject.scale.set(0.16, 0.16, 0.16)
scene.add(fishObject)
scene.add(light)
// scene.add(swimPath.line)

var fishCenter = new THREE.AxesHelper(200)
var fishCenter = new THREE.Object3D()
fishObject.rotation.set(0, -Math.PI / 2, 0)
fishCenter.add(fishObject)
scene.add(fishCenter)

var t = 0
var speed = 0.002
var swimData
var wiggleValue = 0


const offset = -1.5707963267948966 // fishObject.rotation.y initial rotation
fish.swim()

function animate() {
  requestAnimationFrame(animate)
  swimData = fish.update()
  speed = swimData.speed / 2000
  wiggleValue = swimData.xRotation.x

  // set the marker position
  pt = swimPath.spline.getPoint(t)

  // get the tangent to the curve
  tangent = swimPath.spline.getTangent(t)

  // Make sure x is negative at the very end of the path. Otherwise there is a frame where the fish is backwards
  if (tangent.x > 0 && tangent.y < 0.06712 && tangent.y > 0.06710) {
    tangent.x *= -1
    tangent.z *= -1
    tangent.y *= -1
  }

  fishCenter.position.copy(pt)
  fishCenter.lookAt(
    pt.add(new THREE.Vector3(tangent.x, tangent.y, tangent.z))
  )

  // calculate the axis to rotate around
  axis.crossVectors(up, tangent).normalize()

  fishObject.rotation.y = wiggleValue + offset

  t = t >= 1 ? 0 : t += speed

  renderer.render(scene, camera)
}
animate()

function toRadians(angle) {
  return angle * (Math.PI / 180)
}

function toDegrees(angle) {
  return angle * (180 / Math.PI)
}

})()
