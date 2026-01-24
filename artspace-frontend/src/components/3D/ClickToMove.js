import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useRef, useEffect, useState, useCallback } from 'react'

export default function ClickToMove({ floorRef, controlsRef, isActive = true }) {
    const { camera, raycaster, mouse, gl } = useThree()
    const [target, setTarget] = useState(null)
    const markerRef = useRef()
    const velocity = 0.2

    const handleClick = useCallback((e) => {
        if (!isActive || !floorRef.current || !gl?.domElement) return

        const rect = gl.domElement.getBoundingClientRect()
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObject(floorRef.current)

        if (intersects.length > 0) {
            const point = intersects[0].point.clone()
            point.y = 3
            setTarget(point)

            if (markerRef.current) {
                markerRef.current.visible = true
                markerRef.current.position.set(point.x, 0.01, point.z)
            }
        }
    }, [isActive, floorRef, gl, mouse, raycaster, camera])

    useEffect(() => {
        window.addEventListener('click', handleClick)
        return () => window.removeEventListener('click', handleClick)
    }, [handleClick])

    useFrame(() => {
        if (target) {
            const direction = new THREE.Vector3().subVectors(target, camera.position)
            const distance = direction.length()

            if (distance > 0.1) {
                direction.normalize().multiplyScalar(velocity)
                camera.position.add(direction)
                camera.position.y = 3

                if (controlsRef?.current) {
                    controlsRef.current.target.lerp(new THREE.Vector3(target.x, 3, target.z), 0.1)
                    controlsRef.current.update()
                    camera.lookAt(new THREE.Vector3(target.x, 3, target.z))
                }
            } else {
                camera.position.y = 3
                if (controlsRef?.current) {
                    const finalTarget = new THREE.Vector3(target.x, 3, target.z)
                    controlsRef.current.target.copy(finalTarget)
                    controlsRef.current.update()
                    camera.lookAt(finalTarget)
                }

                setTarget(null)
                if (markerRef.current) markerRef.current.visible = false
            }
        }
    })

    return (
        <mesh ref={markerRef} visible={false} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.3, 0.35, 32]} />
            <meshBasicMaterial color="#fa4a7c" side={THREE.DoubleSide} />
        </mesh>
    )
}