var helpers = {
  // Retun random integer between two numbers
  randomInt: (min, max) => Math.floor(Math.random() * (max - min)) + min,

  // Maybe do something
  // probability: number between 0 and 1
  maybe: (probability, callback) => {
    if (Math.random() < probability) {
      callback()
    }
  }
}

class Fish {
  constructor() {
    this.speed = 2
    this.isWiggling = false
    this.wigglesToDo = 0
    this.xRotation = { x: 0 }

    this.INTERVAL = 1000
    this.INERTIA = 0.012
    this.WIGGLE_DURATION = 1000
    this.RATE = 16
    this.MAX_SPEED = 5
    this.MIN_SPEED = 1
    this.PUSH = 0.02
    this.WIGGLE_PROBABILITY = 0.3
    this.MAX_WIGGLE_ROTATAION = 0.12
  }

  getFish() {
    var geometry, material
    // Head
    geometry = new THREE.DodecahedronGeometry(19.5, 2)
    material = new THREE.MeshLambertMaterial({ color: 0xffb200 })
    var fishHead = new THREE.Mesh(geometry, material)
    fishHead.scale.z = .5
    fishHead.scale.y = .8
    fishHead.scale.x = .8
    fishHead.position.x = -2

    // Eyes
    geometry = new THREE.RingGeometry(1, 3, 10)
    material = new THREE.MeshBasicMaterial({ color: 0xffffff })
    var fishEyeRight = new THREE.Mesh(geometry, material)

    fishEyeRight.position.set(0, 5, 7.2)
    fishEyeRight.rotation.y = 0.39
    fishEyeRight.rotation.x = -.3

    var fishEyeLeft = new THREE.Mesh(geometry, material)

    fishEyeLeft.position.set(0, 5, -7.3)
    fishEyeLeft.rotation.y = Math.PI + -.38
    fishEyeLeft.rotation.x = .3

    // Body
    var points = []
    var WIDTH = 21
    var CURVE_FASTNESS = 0.9
    var POS_FROM_HEAD = 10
    var STRETCH = 15
    for (var i = 0; i < 3; i++) {
      points.push(
        new THREE.Vector2(
          Math.sin(i * CURVE_FASTNESS) * WIDTH,
          i * STRETCH - POS_FROM_HEAD
        )
      )
    }

    WIDTH = 21
    CURVE_FASTNESS = .80
    POS_FROM_HEAD = 1
    STRETCH = 11
    for (var i = 3; i < 4; i++) {
      points.push(
        new THREE.Vector2(
          Math.sin(i * CURVE_FASTNESS) * WIDTH,
          i * STRETCH - POS_FROM_HEAD
        )
      )
    }

    WIDTH = 21
    CURVE_FASTNESS = .785
    POS_FROM_HEAD = 5
    STRETCH = 11
    for (var i = 4; i < 5; i++) {
      points.push(
        new THREE.Vector2(
          Math.sin(i * CURVE_FASTNESS) * WIDTH,
          i * STRETCH - POS_FROM_HEAD
        )
      )
    }


    geometry = new THREE.LatheGeometry(points, 50)
    material = new THREE.MeshLambertMaterial({ color: 0xffb200 })
    var fishBody = new THREE.Mesh(geometry, material)
    fishBody.scale.x = .5
    fishBody.scale.z = .7
    fishBody.scale.y = .7

    fishBody.position.set(-20, 0, 0)
    fishBody.rotation.x = 11
    fishBody.rotation.z = 11

    // Tail (top)
    points = []
    WIDTH = 8
    CURVE_FASTNESS = 1.04
    POS_FROM_HEAD = 10
    STRETCH = 7.5

    for (var i = 0; i < 4; i++) {
      points.push(
        new THREE.Vector2(
          Math.sin(i * CURVE_FASTNESS) * WIDTH,
          i * STRETCH - POS_FROM_HEAD
        )
      )
    }

    geometry = new THREE.LatheGeometry(points)
    material = new THREE.MeshLambertMaterial({ color: 0xffb200 })
    var fishTail = new THREE.Mesh(geometry, material)

    fishTail.rotation.z = 0.4
    fishTail.rotation.y = 0
    fishTail.position.set(-28, 5, 0)
    fishTail.scale.z = .1
    fishTail.scale.x = .9
    fishTail.scale.y = .7

    // Tail (bottom)
    var fishTailBottom = new THREE.Mesh(geometry, material)

    fishTailBottom.rotation.z = Math.PI - 0.4
    fishTailBottom.position.set(-28, -6, 0)
    fishTailBottom.scale.z = .1
    fishTailBottom.scale.x = .7
    fishTailBottom.scale.y = 1

    var fish = new THREE.Group()
    // fish.add(fishHead)
    fish.add(fishEyeRight)
    fish.add(fishEyeLeft)
    fish.add(fishBody)
    fish.add(fishTail)
    fish.add(fishTailBottom)

    fish.castShadow = true

    return fish
  }

  swim() {
    const { INTERVAL, MAX_WIGGLE_ROTATAION, WIGGLE_PROBABILITY, PUSH, MIN_SPEED, MAX_SPEED, RATE, WIGGLE_DURATION, INERTIA } = this

    const unsetIsWiggling = () => {
      let interval = setInterval(() => {
        --this.wigglesToDo
        if (this.wigglesToDo == 0) {
          this.isWiggling = false
          clearInterval(interval)
        }
      }, WIGGLE_DURATION)
    }

    const setWiggle = () => {
      this.wigglesToDo = helpers.randomInt(1, 6)
      this.isWiggling = true
      makeTween(MAX_WIGGLE_ROTATAION)

      unsetIsWiggling()
    }

    // Every INTERVAL, if !isWiggling, maybe wiggle some
    const maybeWiggle = setInterval(() => {
      if (!this.isWiggling) {
        helpers.maybe(WIGGLE_PROBABILITY, setWiggle)
      }
    }, INTERVAL)

    const makeTween = (to) => new TWEEN.Tween(this.xRotation)
      .to({ x: to }, WIGGLE_DURATION / 4)
      .easing(TWEEN.Easing.Cubic.Out)
      .onComplete(() => {
        makeTweenBack(to)
      })
      .start()

    const makeTweenBack = (to) => new TWEEN.Tween(this.xRotation)
      .to({ x: 0 }, WIGGLE_DURATION / 4)
      .easing(TWEEN.Easing.Quadratic.In)
      .onComplete(() => {
        if (this.isWiggling) {
          makeTween(-to)
        }
      })
      .start()
  }

  swimPath(arr) {
    var spline = new THREE.SplineCurve3(arr)

    var material = new THREE.LineBasicMaterial({
      color: 0xff00f0
    })

    var geometry = new THREE.Geometry()
    for (var i = 0; i < spline.getPoints(100).length; i++) {
      geometry.vertices.push(spline.getPoints(100)[i])
    }

    return {
      line: new THREE.Line(geometry, material),
      spline
    }
  }

  update() {
    const { PUSH, MIN_SPEED, MAX_SPEED, INERTIA } = this
    // Slow Down
    if (this.speed >= INERTIA + MIN_SPEED) {
      this.speed -= INERTIA
    } else if (this.speed >= INERTIA) {
      this.speed = MIN_SPEED
    }

    // Accelerate
    if (this.isWiggling && this.speed + PUSH < MAX_SPEED) {
      this.speed += PUSH
    }

    TWEEN.update()

    var { speed, isWiggling, wigglesToDo, xRotation } = this
    return { speed, isWiggling, wigglesToDo, xRotation }
  }
}
