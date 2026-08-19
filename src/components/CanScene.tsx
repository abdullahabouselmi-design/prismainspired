import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

/** Shared 0..1 scroll progress across the seven stages. */
export type ProgressRef = { current: number }

const STAGES = 7
const BONE = '#EFE4D1'
const AMBER = '#C98B4B'
// A warm key that lifts the aluminium without tinting it orange.
const KEY_WARM = '#F0D3B0'

// Per-stage targets. Index 0 is stage 01, index 6 is stage 07.
const KEYS = {
  rotY:      [-0.6, 0, 0, 0, 0, 0.18, 0],
  scaleY:    [1, 1.12, 1.12, 1.12, 1.12, 1.12, 1.12],
  scaleXZ:   [1, 0.92, 0.92, 0.92, 0.92, 0.92, 0.92],
  roughness: [0.75, 0.75, 0.35, 0.35, 0.35, 0.35, 0.32],
  posY:      [0, 0, 0, 0.16, 0.16, 0.1, 0],
  ghost:     [0, 0, 0, 0.25, 0.25, 0, 0],
  band:      [0, 0, 0, 0, 1, 1, 1],
  tiltZ:     [0, 0, 0, 0, 0, 0.22, 0],
  camZ:      [6.3, 6.3, 6.3, 6.3, 6.3, 5.5, 5.9],
  keyPower:  [1, 1, 1, 1, 1, 1, 1.55],
}

/** Interpolates a keyframe track at a fractional stage position. */
function track(values: number[], stage: number) {
  const i = Math.max(0, Math.min(STAGES - 2, Math.floor(stage)))
  const t = THREE.MathUtils.clamp(stage - i, 0, 1)
  // Smoothstep between stages so transitions read as eases, not cuts.
  const e = t * t * (3 - 2 * t)
  return THREE.MathUtils.lerp(values[i], values[i + 1], e)
}

/**
 * 355ml can profile, revolved. Rolled base, straight body, tapered shoulder,
 * rolled top rim and a slightly recessed lid. Height:diameter is 2.5:1.
 */
function useCanGeometry() {
  return useMemo(() => {
    const p: THREE.Vector2[] = [
      new THREE.Vector2(0.0, -0.96),
      new THREE.Vector2(0.18, -0.985),
      new THREE.Vector2(0.3, -1.005),
      new THREE.Vector2(0.372, -0.995),
      new THREE.Vector2(0.4, -0.955),
      new THREE.Vector2(0.4, 0.78),
      new THREE.Vector2(0.392, 0.87),
      new THREE.Vector2(0.35, 0.945),
      new THREE.Vector2(0.3, 0.995),
      new THREE.Vector2(0.288, 1.022),
      new THREE.Vector2(0.3, 1.042),
      new THREE.Vector2(0.286, 1.056),
      new THREE.Vector2(0.256, 1.044),
      new THREE.Vector2(0.23, 1.022),
      new THREE.Vector2(0.12, 1.012),
      new THREE.Vector2(0.0, 1.018),
    ]
    const g = new THREE.LatheGeometry(p, 96)
    g.computeVertexNormals()
    return g
  }, [])
}

function Can({ progress }: { progress: ProgressRef }) {
  const geometry = useCanGeometry()
  const group = useRef<THREE.Group>(null)
  const body = useRef<THREE.Mesh>(null)
  const bandRef = useRef<THREE.Mesh>(null)
  const ghostL = useRef<THREE.Mesh>(null)
  const ghostR = useRef<THREE.Mesh>(null)
  const keyLight = useRef<THREE.DirectionalLight>(null)
  const spin = useRef(0)
  const { camera } = useThree()

  useFrame((_, delta) => {
    const stage = THREE.MathUtils.clamp(progress.current, 0, 1) * (STAGES - 1)

    // Stage 07 is the only stage with autonomous motion.
    const finale = THREE.MathUtils.clamp((stage - 5.5) / 0.5, 0, 1)
    spin.current += delta * 0.34 * finale

    if (group.current) {
      group.current.rotation.y = track(KEYS.rotY, stage) + spin.current
      group.current.rotation.z = track(KEYS.tiltZ, stage)
      group.current.position.y = track(KEYS.posY, stage)
      const sy = track(KEYS.scaleY, stage)
      const sxz = track(KEYS.scaleXZ, stage)
      group.current.scale.set(sxz, sy, sxz)
    }

    if (body.current) {
      const m = body.current.material as THREE.MeshStandardMaterial
      m.roughness = track(KEYS.roughness, stage)
    }

    const ghost = track(KEYS.ghost, stage)
    for (const ref of [ghostL, ghostR]) {
      if (!ref.current) continue
      const m = ref.current.material as THREE.MeshStandardMaterial
      m.opacity = ghost
      ref.current.visible = ghost > 0.001
    }

    if (bandRef.current) {
      const b = track(KEYS.band, stage)
      const m = bandRef.current.material as THREE.MeshStandardMaterial
      m.opacity = b
      bandRef.current.visible = b > 0.001
    }

    if (keyLight.current) keyLight.current.intensity = 1.45 * track(KEYS.keyPower, stage)

    const z = track(KEYS.camZ, stage)
    camera.position.z += (z - camera.position.z) * 0.12
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <ambientLight intensity={0.62} color="#f4eee4" />
      {/* Warm key from the upper right. */}
      <directionalLight
        ref={keyLight}
        position={[3.2, 4, 2.6]}
        intensity={1.45}
        color={KEY_WARM}
      />
      {/* Dim cool fill from the left. */}
      <directionalLight position={[-3.4, 1.2, 1.8]} intensity={0.5} color="#a9bdcd" />

      <group ref={group}>
        <mesh ref={body} geometry={geometry} castShadow receiveShadow>
          <meshStandardMaterial color={BONE} roughness={0.75} metalness={0.15} />
        </mesh>

        {/* Stage 05: the first mark it carries. */}
        <mesh ref={bandRef} position={[0, 0.06, 0]} visible={false}>
          <cylinderGeometry args={[0.407, 0.407, 0.3, 96, 1, true]} />
          <meshStandardMaterial
            color={AMBER}
            roughness={0.45}
            metalness={0.1}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Stage 04: the line-up it is compared against. */}
      <mesh ref={ghostL} geometry={geometry} position={[-0.95, 0, -0.5]} visible={false}>
        <meshStandardMaterial color={BONE} roughness={0.7} metalness={0.12} transparent opacity={0} />
      </mesh>
      <mesh ref={ghostR} geometry={geometry} position={[0.95, 0, -0.5]} visible={false}>
        <meshStandardMaterial color={BONE} roughness={0.7} metalness={0.12} transparent opacity={0} />
      </mesh>

      <ContactShadows
        position={[0, -1.06, 0]}
        opacity={0.42}
        scale={5}
        blur={2.6}
        far={2.4}
        resolution={512}
        color="#000000"
      />
    </>
  )
}

type CanSceneProps = {
  progress: ProgressRef
  active: boolean
}

export default function CanScene({ progress, active }: CanSceneProps) {
  return (
    <Canvas
      // Rendering stops entirely while the section is out of view.
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6.3], fov: 30 }}
      style={{ background: 'transparent' }}
    >
      <Can progress={progress} />
    </Canvas>
  )
}
