import React, { useRef, Suspense, useState } from 'react'
import { Text, Environment, Html, useGLTF } from '@react-three/drei'
import { useFrame, useLoader } from '@react-three/fiber'
import ClickToMove from './ClickToMove'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import api from '../../api'

export default function RoomStyle3({ position = [0, 0, 0], controlsRef, artistId, user, roomId, artworksInRoom = [] }) {
    const ceilingLights = useRef([])
    const chandelierRefs = useRef([])
    const floorRef = useRef()

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        ceilingLights.current.forEach((ref) => {
            if (ref) ref.material.emissiveIntensity = 1.5 + Math.sin(t * 2) * 0.5
        })
        chandelierRefs.current.forEach((ref, i) => {
            if (ref?.material) {
                ref.material.emissiveIntensity = 0.25 + Math.sin(t * 4 + i) * 0.05
            }
        })
    })

    const texture = useLoader(TextureLoader, '/textures/8.jpg')
    // eslint-disable-next-line no-unused-vars
    const { scene: frameModel } = useGLTF('/models/artwork_frame.glb')
    const artworkMap = {}
    artworksInRoom.forEach(entry => {
        artworkMap[entry.position_key] = entry.artwork
    })

    const FrameSlot = ({ position, rotation, user, artistId, roomId, slotKey, initialArtwork }) => {
        const { scene: frameModel } = useGLTF('/models/artwork_frame.glb')

        const isOwner = user?.role_id === 2 && user?.artist?.id === artistId
        const [showSelector, setShowSelector] = useState(false)
        const [artworks, setArtworks] = useState([])
        const [selectedArtwork, setSelectedArtwork] = useState(initialArtwork || null)

        const handleClick = async () => {
            if (!showSelector) {
                try {
                    const token = localStorage.getItem("token")
                    const res = await api.get(`/my-artworks`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    setArtworks(res.data.artworks || [])
                } catch (err) {
                    console.error("Erreur lors de la récupération des œuvres :", err)
                }
            }
            setShowSelector(!showSelector)
        }

        const handleSelectArtwork = async (artwork) => {
            setSelectedArtwork(artwork)
            setShowSelector(false)
            try {
                const token = localStorage.getItem("token")
                await api.post(`/rooms/${roomId}/assign-artwork`, {
                    artwork_id: artwork.id,
                    position_key: slotKey,
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            } catch (err) {
                console.error("Erreur d’enregistrement:", err)
            }
        }

        const imageUrl = (image) => {
            return image.startsWith("http")
                ? image
                : `http://localhost:8000${image}`
        }

        return (
            <group position={position} rotation={rotation}>
                <primitive object={frameModel.clone()} scale={[20, 20, 20]} />
                {selectedArtwork && (
                    <Html center position={[0, 1.5, 0.1]} distanceFactor={8}>
                        <div style={{
                            width: '180px',
                            height: '290px',
                            border: '3px solid white',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            boxShadow: '0 0 8px rgba(0,0,0,0.4)',
                            background: 'white',
                        }}>
                            <img
                                src={imageUrl(selectedArtwork.image)}
                                alt={selectedArtwork.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                    </Html>
                )}

                {isOwner && (
                    <group position={[0, 1.2, 0.1]}>
                        <mesh onClick={handleClick}>
                            <circleGeometry args={[0.6, 32]} />
                            <meshBasicMaterial color="#d3bb75" />
                        </mesh>
                        <Text
                            fontSize={0.4}
                            color="#fff"
                            anchorX="center"
                            anchorY="middle"
                            position={[0, 0, 0.01]}
                        >
                            +
                        </Text>
                        {showSelector && (
                            <Html center distanceFactor={10}>
                                <div className="bg-white p-2 rounded shadow max-h-40 overflow-y-auto w-44">
                                    <h3 className="text-sm font-bold mb-2 text-gray-700">Mes œuvres</h3>
                                    {artworks.length === 0 ? (
                                        <p className="text-xs text-gray-500">Aucune œuvre.</p>
                                    ) : (
                                        <ul className="space-y-1">
                                            {artworks.data.map((art) => (
                                                <li
                                                    key={art.id}
                                                    onClick={() => handleSelectArtwork(art)}
                                                    className="cursor-pointer text-xs text-gray-800 hover:text-[#3a6b8f] transition"
                                                >
                                                    {art.title}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </Html>
                        )}
                    </group>
                )}
            </group>
        )
    }

    const renderFrames = () => {
        const positions = []
        for (let i = 0; i < 3; i++) {
            positions.push({ key: `left-${i}`, pos: [-14.9, 1.5, -10 + i * 10], rot: [0, Math.PI / 2, 0] })
            positions.push({ key: `right-${i}`, pos: [14.9, 1.5, 10 - i * 10], rot: [0, -Math.PI / 2, 0] })
            positions.push({ key: `back-${i}`, pos: [-10 + i * 9, 1.5, -14.9], rot: [0, 0, 0] })
            positions.push({ key: `front-${i}`, pos: [-10 + i * 10, 1.5, 14.9], rot: [0, Math.PI, 0] })
        }

        return positions.map(({ key, pos, rot }) => (
            <FrameSlot
                key={key}
                slotKey={key}
                position={pos}
                rotation={rot}
                user={user}
                artistId={artistId}
                roomId={roomId}
                initialArtwork={artworkMap[key]}
            />
        ))
    }

    return (
        <group position={position}>
            {/* Sol effet marbre clair */}
            <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial map={texture} side={THREE.DoubleSide} metalness={0.1} roughness={0.2} />
            </mesh>

            {/* Murs beiges */}
            {[
                [0, 2.5, -15],
                [0, 2.5, 15],
                [-15, 2.5, 0],
                [15, 2.5, 0]
            ].map(([x, y, z], i) => (
                <mesh key={`wall-${i}`} position={[x, y, z]} receiveShadow>
                    <boxGeometry args={z === 0 ? [0.2, 7, 30] : [30, 7, 0.2]} />
                    <meshStandardMaterial color="#f0e8dd" roughness={0.25} metalness={0.2} />
                </mesh>
            ))}

            {/* Plafond */}
            <mesh position={[0, 6.05, 0]} receiveShadow>
                <boxGeometry args={[30, 0.1, 30]} />
                <meshStandardMaterial color="#e5dcd2" roughness={1} metalness={0.2} />
            </mesh>

            {/* LED plafond */}
            {[[-13, 6, -10], [13, 6, -10], [-13, 6, 10], [13, 6, 10]].map(([x, y, z], i) => (
                <mesh key={`ceiling-light-${i}`} position={[x, y, z]}>
                    <boxGeometry args={[6, 0.04, 0.1]} />
                    <meshStandardMaterial color="#ffd89b" metalness={0.5} roughness={0.4} />
                </mesh>
            ))}

            {/* Lustres */}
            {[[-10, 5.7, -10], [10, 5.7, -10], [-10, 5.7, 10], [10, 5.7, 10]].map(([x, y, z], i) => (
                <group key={`lustre-${i}`} position={[x, y, z]}>
                    <mesh position={[0, 0.3, 0]}>
                        <cylinderGeometry args={[0.02, 0.06, 0.6, 16]} />
                        <meshStandardMaterial color="#ffd89b" metalness={1} roughness={0.4} />
                    </mesh>
                    <mesh ref={(el) => (chandelierRefs.current[i] = el)} position={[0, -0.5, 0]}>
                        <cylinderGeometry args={[0.2, 0.2, 1.1, 32]} />
                        <meshStandardMaterial color="#d4af37" emissive="#fff5cc" emissiveIntensity={0.3} metalness={1} roughness={0.1} />
                    </mesh>
                    <pointLight position={[0, -0.5, 0]} intensity={2.5} distance={8} decay={2} color="#fff8e7" />
                    <spotLight position={[x, y + 1, z + 2]} angle={0.3} penumbra={0.4} intensity={1.5} castShadow />
                </group>
            ))}

            {/* LED sol */}
            {[[-15, 0.01, -15], [-15, 0.01, 15], [15, 0.01, -15], [15, 0.01, 15]].map(([x, y, z], i) => (
                <mesh key={`floor-led-${i}`} position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[6, 0.05]} />
                    <meshStandardMaterial emissive="#ffdead" emissiveIntensity={2.5} color="#f8d8aa" />
                </mesh>
            ))}

            <Environment files="/hdri/empty_warehouse_01_1k.hdr" background />
            <ambientLight intensity={0.95} color="#fff8dc" />
            <pointLight position={[0, 6, 0]} intensity={1.8} color="#ffe4b5" />

            <Text position={[0, 5.7, -14.7]} fontSize={0.5} color="#4b3c2f" anchorX="center" anchorY="middle" maxWidth={20}>
                GOLDEN ROOM — MODERN STYLE
            </Text>

            <Suspense fallback={null}>{renderFrames()}</Suspense>
            <ClickToMove floorRef={floorRef} controlsRef={controlsRef} />
        </group>
    )
}

useGLTF.preload('/models/artwork_frame.glb')