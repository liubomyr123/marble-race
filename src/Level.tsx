import { useGLTF, Text, Float } from '@react-three/drei';
import { Vector3, useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider, RapierRigidBody } from '@react-three/rapier';
import { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import useGame from './stores/useGame';

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' });
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' });
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' });

interface BlockStartProps {
    position: Vector3
}

export function BlockStart({
    position = [0, 0, 0],
}: BlockStartProps) {
    return (
        <group position={position}>

            <Float floatIntensity={0.25} rotationIntensity={0.25}>
                <Text
                    font="./bebas-neue-v9-latin-regular.woff"
                    scale={0.5}
                    maxWidth={0.25}
                    lineHeight={0.75}
                    textAlign="right"
                    position={[0.75, 0.65, 0]}
                    rotation-y={- 0.25}
                >
                    Marble Race
                    <meshBasicMaterial
                        toneMapped={false}
                    />
                </Text>
            </Float>

            <mesh
                geometry={boxGeometry}
                material={floor1Material}
                scale={[4, 0.2, 4]}
                position={[0, -0.1, 0]}
                receiveShadow
            />
        </group>
    )
}

interface BlockSpinnerProps {
    position: Vector3
}

export function BlockSpinner({
    position = [0, 0, 0],
}: BlockSpinnerProps) {
    const obstacle = useRef<RapierRigidBody | null>(null);
    const [speed] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1));


    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        const rotation = new THREE.Quaternion();
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
        if (obstacle.current) {
            obstacle.current.setNextKinematicRotation(rotation)
        }
    });

    return (
        <group position={position}>
            <mesh
                geometry={boxGeometry}
                material={floor2Material}
                scale={[4, 0.2, 4]}
                position={[0, -0.1, 0]}
                receiveShadow
            />

            {/* Spinner obstacle */}
            <RigidBody
                ref={obstacle}
                type='kinematicPosition'
                position={[0, 0.3, 0]}
                restitution={0.2}
                friction={0}
            >
                <mesh
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[3.5, 0.2, 0.3]}
                    receiveShadow
                    castShadow
                />
            </RigidBody>

        </group>
    )
}

interface BlockLimboProps {
    position: Readonly<Parameters<THREE.Vector3['set']>>  //  Vector3
}

export function BlockLimbo({
    position = [0, 0, 0],
}: BlockLimboProps) {
    const obstacle = useRef<RapierRigidBody | null>(null);
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2);


    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        const y = Math.sin(time + timeOffset) + 1.15;
        if (obstacle.current) {
            obstacle.current.setNextKinematicTranslation({
                x: position[0],
                y: position[1] + y,
                z: position[2]
            })
        }
    });

    return (
        <group position={position}>
            <mesh
                geometry={boxGeometry}
                material={floor2Material}
                scale={[4, 0.2, 4]}
                position={[0, -0.1, 0]}
                receiveShadow
            />

            {/* Limbo obstacle */}
            <RigidBody
                ref={obstacle}
                type='kinematicPosition'
                position={[0, 0.3, 0]}
                restitution={0.2}
                friction={0}
            >
                <mesh
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[3.5, 0.2, 0.3]}
                    receiveShadow
                    castShadow
                />
            </RigidBody>

        </group>
    )
}

interface BlockAxeProps {
    position: Readonly<Parameters<THREE.Vector3['set']>>  //  Vector3
}

export function BlockAxe({
    position = [0, 0, 0],
}: BlockAxeProps) {
    const obstacle = useRef<RapierRigidBody | null>(null);
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2);


    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        const x = Math.sin(time + timeOffset) * 1.25;
        if (obstacle.current) {
            obstacle.current.setNextKinematicTranslation({
                x: position[0] + x,
                y: position[1] + 0.75,
                z: position[2],
            })
        }
    });

    return (
        <group position={position}>
            <mesh
                geometry={boxGeometry}
                material={floor2Material}
                scale={[4, 0.2, 4]}
                position={[0, -0.1, 0]}
                receiveShadow
            />

            {/* Axe obstacle */}
            <RigidBody
                ref={obstacle}
                type='kinematicPosition'
                position={[0, 0.3, 0]}
                restitution={0.2}
                friction={0}
            >
                <mesh
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[1.5, 1.5, 0.3]}
                    receiveShadow
                    castShadow
                />
            </RigidBody>

        </group>
    )
}

interface BlockEndProps {
    position: Vector3
}

export function BlockEnd({
    position = [0, 0, 0],
}: BlockEndProps) {

    const hamburger = useGLTF('./hamburger.glb');
    hamburger.scene.children.forEach((mesh) => {
        mesh.castShadow = true;
    })

    return (
        <group position={position}>
            <Text
                font="./bebas-neue-v9-latin-regular.woff"
                scale={1}
                position={[0, 2.25, 2]}
            >
                FINISH
                <meshBasicMaterial toneMapped={false} />
            </Text>

            <mesh
                geometry={boxGeometry}
                material={floor1Material}
                scale={[4, 0.2, 4]}
                position={[0, 0, 0]}
                receiveShadow
            />
            <RigidBody
                type='fixed'
                colliders='hull'
                restitution={0.2}
                friction={0}
                position={[0, 0.25, 0]}
            >
                <primitive object={hamburger.scene} scale={0.2} />
            </RigidBody>
        </group>
    )
}

export function Bounds({
    length = 1
}) {

    return (
        <>
            <RigidBody type='fixed'
                restitution={0.2}
                friction={0}
            >
                <mesh
                    position={[2.15, 0.75,
                        -(length * 2) + 2
                    ]}
                    geometry={boxGeometry}
                    material={wallMaterial}
                    scale={[0.3, 1.5, 4 * length]}
                    castShadow
                />
                <mesh
                    position={[-2.15, 0.75,
                    -(length * 2) + 2
                    ]}
                    geometry={boxGeometry}
                    material={wallMaterial}
                    scale={[0.3, 1.5, 4 * length]}
                    // castShadow
                    receiveShadow
                />
                <mesh
                    position={[0, 0.75,
                        -(length * 4) + 2
                    ]}
                    geometry={boxGeometry}
                    material={wallMaterial}
                    scale={[4, 1.5, 0.3]}
                    // castShadow
                    receiveShadow
                />

                <CuboidCollider
                    args={[2, 0.1, 2 * length]}
                    position={[0, -0.1, - (length * 2) + 2]}
                    restitution={0.2}
                    friction={1}
                />
            </RigidBody>
        </>
    )
}

export function Level({
    count = 5,
    // types = [
    //     BlockSpinner,
    //     BlockAxe,
    //     BlockLimbo,
    // ],
    seed = 0
}) {
    const types_ = useGame((state) => state.types);

    // console.log({
    //     types: types_
    // });

    const types: (
        typeof BlockLimbo |
        typeof BlockSpinner |
        typeof BlockAxe
    )[] = [];

    if (types_.limbo) {
        types.push(BlockLimbo)
    }
    if (types_.spinner) {
        types.push(BlockSpinner)
    }
    if (types_.wall) {
        types.push(BlockAxe)
    }
    const blocks = useMemo(() => {
        const blocksInternal = [];

        for (let i = 0; i < count; i++) {
            const type = types[
                Math.floor(Math.random() * types.length)
            ];

            blocksInternal.push(type);
        }

        return blocksInternal;
    }, [count, types, seed]);

    return <>

        <BlockStart
            position={[0, 0, 0]}
        />

        {blocks.map((Block, index) => {
            return (
                <Block
                    key={index}
                    position={[0, 0, -(index + 1) * 4]}
                />
            )
        })}

        <BlockEnd
            position={[0, 0,
                -(count + 1) * 4
            ]}
        />

        <Bounds
            length={count + 2}
        />
    </>
}