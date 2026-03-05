import { useEffect, useRef } from 'react'

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let renderer: any, scene: any, camera: any, animate: any
    let three: any
    let frameId: number
    let width = 600
    let height = 400

    async function init() {
      // Dynamically import three.js
      three = await import('three')
      renderer = new three.WebGLRenderer({ canvas: canvasRef.current, antialias: true })
      renderer.setSize(width, height)
      scene = new three.Scene()
      camera = new three.PerspectiveCamera(75, width / height, 0.1, 1000)
      camera.position.z = 5

      // Add a light
      const light = new three.PointLight(0xffffff, 1, 100)
      light.position.set(10, 10, 10)
      scene.add(light)

      // Add a spinning globe (Earth)
      const geometry = new three.SphereGeometry(1.5, 32, 32)
      const material = new three.MeshStandardMaterial({ color: 0x2194ce, wireframe: false })
      const globe = new three.Mesh(geometry, material)
      scene.add(globe)

      // Add sample data points as small spheres
      for (let i = 0; i < 10; i++) {
        const lat = Math.random() * Math.PI - Math.PI / 2
        const lon = Math.random() * 2 * Math.PI
        const r = 1.55
        const x = r * Math.cos(lat) * Math.cos(lon)
        const y = r * Math.sin(lat)
        const z = r * Math.cos(lat) * Math.sin(lon)
        const pointGeo = new three.SphereGeometry(0.07, 16, 16)
        const pointMat = new three.MeshStandardMaterial({ color: 0xff6347 })
        const point = new three.Mesh(pointGeo, pointMat)
        point.position.set(x, y, z)
        scene.add(point)
      }

      // Animation loop
      animate = function () {
        globe.rotation.y += 0.01
        renderer.render(scene, camera)
        frameId = requestAnimationFrame(animate)
      }
      animate()
    }

    init()
    return () => {
      if (frameId) cancelAnimationFrame(frameId)
      if (renderer) renderer.dispose && renderer.dispose()
    }
  }, [])

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} width={600} height={400} style={{ borderRadius: 12, background: '#e0f2fe' }} />
      <p className="text-xs text-gray-500 mt-2">3D globe with sample data points (Three.js demo)</p>
    </div>
  )
}
