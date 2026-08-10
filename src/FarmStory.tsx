import { Float, Sparkles } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

type Props = { progress: number; reduced: boolean }
const clamp = (x: number) => Math.min(1, Math.max(0, x))
const range = (x: number, a: number, b: number) => clamp((x - a) / (b - a))
const ease = (x: number) => x * x * (3 - 2 * x)
const leafShape = new THREE.Shape()
leafShape.moveTo(0, 0); leafShape.bezierCurveTo(.42, .15, .43, .82, 0, 1.25); leafShape.bezierCurveTo(-.43, .82, -.42, .15, 0, 0)
const leafGeometry = new THREE.ExtrudeGeometry(leafShape, { depth: .012, bevelEnabled: true, bevelSize: .008, bevelThickness: .006, bevelSegments: 2 })

function Camera({ progress }: { progress: number }) {
  const { camera } = useThree()
  useFrame(() => {
    const p = progress
    const target = new THREE.Vector3(
      THREE.MathUtils.lerp(0, -3.4, ease(range(p, .44, .92))),
      THREE.MathUtils.lerp(.15, 2.7, ease(range(p, .48, 1))),
      THREE.MathUtils.lerp(7.2, 16, ease(range(p, .58, 1))),
    )
    camera.position.lerp(target, .1)
    camera.lookAt(THREE.MathUtils.lerp(0, -2, range(p, .48, 1)), THREE.MathUtils.lerp(-.4, 0, range(p, .58, 1)), 0)
  })
  return null
}

function Root({ angle, length, progress }: { angle: number; length: number; progress: number }) {
  const ref = useRef<THREE.Group>(null)
  const growth = ease(range(progress, .14, .38))
  useFrame(() => { if (ref.current) ref.current.scale.y = Math.max(.01, growth) })
  return <group rotation={[0, angle, Math.PI / 2.35]}><group ref={ref} position={[0, -length / 2, 0]}>
    <mesh><cylinderGeometry args={[.032, .075, length, 7]} /><meshStandardMaterial color="#c9965a" roughness={1} /></mesh>
    <mesh position={[0, -length * .42, 0]} rotation={[0, .65, .35]}><cylinderGeometry args={[.012, .036, length * .48, 6]} /><meshStandardMaterial color="#b77d48" roughness={1} /></mesh>
  </group></group>
}

function SeedAndPlant({ progress }: { progress: number }) {
  const seed = useRef<THREE.Group>(null)
  const stem = useRef<THREE.Group>(null)
  const tree = useRef<THREE.Group>(null)
  const sprout = ease(range(progress, .31, .58))
  const mature = ease(range(progress, .68, .94))
  useFrame((state) => {
    if (seed.current) { seed.current.position.y = THREE.MathUtils.lerp(.3, -.72, ease(range(progress, 0, .24))); seed.current.rotation.z += .006 }
    if (stem.current) stem.current.scale.y = Math.max(.01, sprout)
    if (tree.current) { tree.current.scale.setScalar(Math.max(.01, mature)); tree.current.rotation.y = Math.sin(state.clock.elapsedTime * .13) * .025 }
  })
  return <group>
    <group ref={seed} rotation={[.2, 0, -.35]}>
      <mesh scale={[.43, .28, .3]}><sphereGeometry args={[1, 64, 32]} /><meshPhysicalMaterial color="#7c4825" roughness={.72} clearcoat={.08} /></mesh>
      <mesh position={[.18, .14, .19]} scale={[.15, .07, .04]} rotation={[0, .3, .2]}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#4b2818" roughness={1} /></mesh>
      {Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[Math.sin(i * 5.2) * .32, Math.cos(i * 3.7) * .19, .255]} scale={[.018, .011, .005]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#b97943" roughness={1} /></mesh>)}
    </group>
    <group ref={stem} position={[0, -.78, 0]}>
      <mesh position={[0, 1.25, 0]}><cylinderGeometry args={[.045, .075, 2.5, 8]} /><meshStandardMaterial color="#477d35" roughness={.8} /></mesh>
      <Leaf position={[-.37, 1.65, 0]} rotation={[0, 0, -.8]} /><Leaf position={[.37, 2.05, .02]} rotation={[0, 0, .8]} />
    </group>
    <group ref={tree} position={[0, -.75, 0]}>
      <mesh position={[0, 1.8, 0]}><cylinderGeometry args={[.32, .7, 3.6, 18]} /><meshStandardMaterial color="#5a3822" roughness={1} /></mesh>
      {[[-.8, 3.1, -.1, -.6], [.82, 3.3, .1, .62], [-.65, 4.1, .1, -.5], [.65, 4.3, 0, .55], [0, 4.8, 0, 0]].map(([x, y, z, r], i) => <mesh key={i} position={[x, y, z]} rotation={[0, 0, r]}><cylinderGeometry args={[.075, .2, 2, 12]} /><meshStandardMaterial color="#604027" roughness={1} /></mesh>)}
      <LeafyCrown />
    </group>
  </group>
}

function Leaf({ position, rotation, scale = 1, color = '#6e9c3d' }: { position: [number, number, number], rotation: [number, number, number], scale?: number, color?: string }) {
  return <group position={position} rotation={rotation} scale={scale}><mesh geometry={leafGeometry}><meshStandardMaterial color={color} roughness={.68} side={THREE.DoubleSide} /></mesh><mesh position={[0, .62, .015]} scale={[.018, .64, .1]}><boxGeometry /><meshStandardMaterial color="#42672b" /></mesh></group>
}

function LeafyCrown() {
  const leaves = useMemo(() => Array.from({ length: 110 }, (_, i) => {
    const a = i * 2.39996, radius = .35 + ((i * 17) % 100) / 100 * 1.75
    return { x: Math.cos(a) * radius, y: 4.15 + Math.sin(i * 1.71) * .6 + ((i % 9) * .13), z: Math.sin(a) * radius * .58, r: (i * .73) % 6.28, s: .42 + (i % 5) * .06, c: i % 3 === 0 ? '#426e32' : i % 3 === 1 ? '#5e8c3e' : '#789d47' }
  }), [])
  return <group>{leaves.map((leaf, i) => <Leaf key={i} position={[leaf.x, leaf.y, leaf.z]} rotation={[.4 + (i % 3) * .2, leaf.r, .25 * Math.sin(i)]} scale={leaf.s} color={leaf.c} />)}</group>
}

function Terrain({ progress }: { progress: number }) {
  const farm = ease(range(progress, .52, .8))
  const trees = useMemo(() => Array.from({ length: 45 }, (_, i) => ({ x: ((i * 17) % 19) - 9.5, z: ((i * 31) % 17) - 8.5, s: .18 + (i % 5) * .055 })), [])
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.92, 0]}><planeGeometry args={[28, 28, 32, 32]} /><meshStandardMaterial color="#4b2f1d" roughness={1} /></mesh>
    <group scale={[farm, farm, farm]}>{trees.map((tree, i) => <group key={i} position={[tree.x, -.82, tree.z]}><mesh position={[0, tree.s * .7, 0]}><cylinderGeometry args={[tree.s * .11, tree.s * .15, tree.s * 1.4, 5]} /><meshStandardMaterial color="#62402a" /></mesh><mesh position={[0, tree.s * 1.6, 0]} scale={[tree.s * 1.5, tree.s * 1.35, tree.s * 1.5]}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#476f36" roughness={1} flatShading /></mesh></group>)}
      <mesh position={[-3.8, -.89, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.2, 17]} /><meshStandardMaterial color="#a88a4d" roughness={1} /></mesh>
      <mesh position={[4.3, -.885, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.4, 17]} /><meshStandardMaterial color="#557ca1" roughness={.5} metalness={.15} /></mesh>
      <group position={[2.3, -.86, -2.7]}><mesh position={[0, .5, 0]}><boxGeometry args={[1.6, 1, 1.4]} /><meshStandardMaterial color="#e3cf9e" /></mesh><mesh position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[1.25, 1, 4]} /><meshStandardMaterial color="#664631" /></mesh></group>
    </group>
  </group>
}

export function FarmStory({ progress, reduced }: Props) {
  const underground = 1 - ease(range(progress, .32, .52))
  const sky = ease(range(progress, .38, .62))
  return <>
    <color attach="background" args={[sky > .5 ? '#9ab998' : '#10140d']} />
    <fog attach="fog" args={[sky > .5 ? '#9ab998' : '#10140d', 7, 26]} />
    <ambientLight intensity={.45 + sky * 1.15} color={sky > .5 ? '#fff1c9' : '#8f7658'} />
    <directionalLight position={[-4, 7, 3]} intensity={.5 + sky * 2.5} color="#f5d58a" castShadow />
    <Camera progress={progress} />
    <Terrain progress={progress} />
    <group scale={[1, underground, 1]} position={[0, -.4 * (1 - underground), 0]}>{[0, 1.05, 2.1, 3.14, 4.19, 5.23].map((a, i) => <Root key={i} angle={a} length={1.5 + (i % 3) * .35} progress={progress} />)}</group>
    <SeedAndPlant progress={progress} />
    {!reduced && <Sparkles count={75} scale={[12, 8, 12]} size={2} speed={.2} opacity={.35 + sky * .35} color={sky > .5 ? '#f7e1a7' : '#c58e59'} />}
    <Float speed={.35} rotationIntensity={.05} floatIntensity={.08}><mesh position={[0, -.9, 0]} visible={false}><sphereGeometry /></mesh></Float>
  </>
}
