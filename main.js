(function(){
const DIVULGE = {"glyphs":{"J":{"ha":682,"x_min":0,"x_max":0,"o":"m 589 263 b 304 -12 589 81 482 -12 b 24 218 142 -12 24 76 b 43 318 24 253 29 290 l 235 328 b 213 239 222 306 213 271 b 304 146 213 183 240 146 b 397 263 363 146 397 185 l 397 954 l 589 954 "},"S":{"ha":861,"x_min":0,"x_max":0,"o":"m 596 621 b 426 807 596 767 514 807 b 290 699 346 807 290 764 b 431 585 290 629 357 603 b 635 519 486 571 567 546 b 794 261 707 489 794 422 b 435 -12 794 122 664 -12 b 68 306 217 -12 78 118 l 258 325 b 435 147 258 211 338 147 b 603 261 542 147 603 201 b 458 411 603 367 526 392 b 99 699 331 447 99 458 b 426 967 99 853 231 967 b 781 656 631 967 781 869 "},"j":{"ha":325,"x_min":0,"x_max":0,"o":"m 239 -156 b 63 -333 239 -258 193 -333 b -90 -247 7 -333 -62 -304 l -54 -129 b 43 -197 -37 -165 -3 -197 b 85 -156 63 -197 85 -187 l 85 617 l 239 617 m 238 747 l 85 747 l 85 894 l 238 894 "},"s":{"ha":646,"x_min":0,"x_max":0,"o":"m 421 422 b 321 492 414 474 372 492 b 244 444 275 492 244 476 b 296 404 244 422 271 410 b 579 178 419 378 579 347 b 326 -12 579 83 493 -12 b 69 188 197 -12 81 58 l 228 206 b 326 124 232 140 292 124 b 426 178 390 124 426 151 b 92 444 426 307 92 196 b 325 629 92 558 185 629 b 575 436 483 629 572 554 "}},"familyName":"Divulge Rg","ascender":1333,"descender":-333,"underlinePosition":-104,"underlineThickness":69,"boundingBox":{"yMin":-333,"xMin":-140,"yMax":1333,"xMax":1315},"resolution":1000,"original_font_information":{"format":0,"copyright":"Copyright (c) 2008-2010 Typodermic Fonts. This font is not freely distributable. Visit typodermic.com for more info.","fontFamily":"Divulge Rg","fontSubfamily":"Bold","uniqueID":"1.100;TYPO;DivulgeRg-Bold","fullName":"DivulgeRg-Bold","version":"Version 1.102","postScriptName":"DivulgeRg-Bold","trademark":"Divulge is a trademark of Typodermic Fonts","manufacturer":"Ray Larabie","designer":"Ray Larabie","manufacturerURL":"http://www.typodermic.com","designerURL":"http://www.typodermic.com","licence":"Please read the current Typodermic Fonts license agreement at http://www.typodermic.com/license.html","licenceURL":"http://www.typodermic.com/license.html","preferredFamily":"Divulge"},"cssFontWeight":"bold","cssFontStyle":"normal"}

var fish = new Fish()
var swimPath = fish.swimPath([
  new THREE.Vector3(-37, 26, 90), //bl
  new THREE.Vector3(-45, 25, 92), //l

  new THREE.Vector3(-34, 23, 110), //fl
  new THREE.Vector3(-20, 23, 113), //f

  new THREE.Vector3(-6, 26, 110), //fr
  new THREE.Vector3(-5, 31, 92), //r

  new THREE.Vector3(-15, 30, 77), //br
  new THREE.Vector3(-27, 27, 79), //b

  new THREE.Vector3(-37, 26, 90),
])

var scene = new THREE.Scene()
scene.background = new THREE.Color( 0x363129 )
var camera = new THREE.PerspectiveCamera(75, 320 / 150, .1, 200)
var renderer = new THREE.WebGLRenderer()

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

renderer.setSize(320 * 5, 150 * 5)
document.querySelector('.goldfish').appendChild(renderer.domElement)

// Floor
var geometry = new THREE.PlaneGeometry( 200, 200, 200 );
var material = new THREE.ShadowMaterial({
  side: THREE.DoubleSide
});
var plane = new THREE.Mesh( geometry, material );

plane.rotation.x = toRadians(90)

plane.position.x = -90
plane.position.y = -3
plane.position.z = 5
plane.receiveShadow = true
scene.add( plane );

// Text
var loader = new THREE.FontLoader()
var font = loader.parse(DIVULGE)
var geometry = new THREE.TextGeometry('JS', {
  font: font,
  size: 45,
  height: 1,
  curveSegments: 50,
	bevelEnabled: true,
	bevelThickness: 8,
	bevelSize: 1,
  material: 0,
  extrudeMaterial: 0,
	bevelSegments: 50
})

var material = new THREE.MeshPhongMaterial({
  color: 0x36e1c8
})

var text = new THREE.Mesh(geometry, material)
    text.castShadow = true
    text.rotation.y = 0.3
    text.position.set(-55, 0, 100)
    scene.add(text)

camera.position.x = -3
camera.position.y = 18
camera.position.z = 150

// Build Group
var fishObject = fish.getFish()
fishObject.scale.set(0.16, 0.16, 0.16)
scene.add(fishObject)
scene.add(light)
//scene.add(swimPath.line)

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

/* Dragging */
// var isDragging = false
// var previousMousePosition = {
//   x: 0,
//   y: 0
// }
// $(renderer.domElement)
//   .on('mousedown', e => {
//     isDragging = true
//   })
//   .on('mousemove', function(e) {
//     var deltaMove = {
//       x: e.offsetX - previousMousePosition.x,
//       y: e.offsetY - previousMousePosition.y
//     }
//
//     if (isDragging) {
//       var deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
//         new THREE.Euler(
//           toRadians(deltaMove.y * 1),
//           toRadians(deltaMove.x * 1),
//           0,
//           'XYZ'
//         )
//       )
//       fishObject.quaternion.multiplyQuaternions(
//         deltaRotationQuaternion,
//         fishObject.quaternion
//       )
//     }
//
//     previousMousePosition = {
//       x: e.offsetX,
//       y: e.offsetY
//     }
//   })
/* */

// $(document).on('mouseup', function(e) {
//   isDragging = false
// })

function toRadians(angle) {
  return angle * (Math.PI / 180)
}

function toDegrees(angle) {
  return angle * (180 / Math.PI)
}

})()
