import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber"
import { RapierRigidBody, RigidBody, useRapier } from "@react-three/rapier"
import { useRef, useEffect, useState } from "react";
import * as THREE from 'three'
import useGame from './stores/useGame'

export default function Player() {
    const body = useRef<RapierRigidBody | null>(null);

    const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10))
    const [smoothedCameraTarget] = useState(() => new THREE.Vector3())

    const [subscribeKeys, getKeys] = useKeyboardControls();

    const { rapier, world: rapierWorld } = useRapier();

    const start = useGame((state) => state.start);
    const end = useGame((state) => state.end);
    const blocksCount = useGame((state) => state.blocksCount);

    const restart = useGame((state) => state.restart);

    const jump = () => {
        if (!body.current) return;
        const origin = body.current.translation();
        origin.y -= 0.31;

        const direction = {
            x: 0,
            y: -1,
            z: 0
        }

        const ray = new rapier.Ray(origin, direction);

        const hit = rapierWorld.castRay(ray, 10, true);

        // If check on null -> jump will not work
        if (hit!.toi < 0.15) {
            body.current.applyImpulse({
                x: 0,
                y: 0.5,
                z: 0,
            }, true)
        }
    }

    const reset = () => {
        if (!body.current) return;
        body.current.setTranslation({ x: 0, y: 1, z: 0 }, false)
        body.current.setLinvel({ x: 0, y: 0, z: 0 }, false)
        body.current.setAngvel({ x: 0, y: 0, z: 0 }, false)
    }

    useEffect(() => {
        const unsubscribeReset = useGame.subscribe(
            (state) => {
                return state.phase;
            },
            (value) => {
                if (value === 'ready') {
                    reset()
                }
            },
        )

        const unsubscribeJump = subscribeKeys(
            (state) => {
                return state.jump;
            },
            (value) => {
                if (value) {
                    jump();
                }
            },
        )

        const unsubscribeRestart = subscribeKeys(
            (state) => {
                return state.restart;
            },
            (value) => {
                if (value) {
                    reset()
                    restart();
                }
            },
        )

        const unsubscribeAny = subscribeKeys(
            (state) => {
                if (
                    state.backward ||
                    state.forward ||
                    state.jump ||
                    state.leftward ||
                    state.rightward
                ) {
                    start();
                }
            },
        )

        return () => {
            unsubscribeJump();
            unsubscribeAny();
            unsubscribeReset();
            unsubscribeRestart();
        }
    }, [])

    useFrame((state, delta) => {
        if (!body.current) return;
        const { forward, backward, leftward, rightward } = getKeys();

        const impulse = {
            x: 0,
            y: 0,
            z: 0,
        };

        const torque = {
            x: 0,
            y: 0,
            z: 0,
        };

        const impulseStrength = 0.6 * delta;
        const torqueStrength = 0.2 * delta;

        if (forward) {
            impulse.z -= impulseStrength;
            torque.x -= torqueStrength;
        }

        if (rightward) {
            impulse.x += impulseStrength;
            torque.z -= torqueStrength;
        }

        if (backward) {
            impulse.z += impulseStrength;
            torque.x += torqueStrength;
        }

        if (leftward) {
            impulse.x -= impulseStrength;
            torque.z += torqueStrength;
        }

        body.current.applyImpulse(impulse, true);
        body.current.applyTorqueImpulse(torque, true);





        const bodyPosition = body.current.translation();

        const cameraPosition = new THREE.Vector3();
        // @ts-ignore
        cameraPosition.copy(bodyPosition);
        cameraPosition.z += 2.25;
        cameraPosition.y += 0.65;

        const cameraTarget = new THREE.Vector3();
        // @ts-ignore
        cameraTarget.copy(bodyPosition);
        cameraTarget.y += 0.25;

        smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

        state.camera.position.copy(smoothedCameraPosition);
        state.camera.lookAt(smoothedCameraTarget);





        if (bodyPosition.z < -(blocksCount * 4 + 2)) {
            end();
        }




        if (bodyPosition.y < -4) {
            restart();
        }

    });

    return (
        <>
            <RigidBody
                ref={body}
                position={[0, 1, 0]}
                colliders='ball'
                restitution={0.2}
                friction={1}
                canSleep={false}
                linearDamping={0.5}
                angularDamping={0.5}
            >
                <mesh castShadow>
                    <icosahedronGeometry
                        args={[0.3, 1]}
                    />
                    <meshStandardMaterial
                        color='mediumpurple'
                        flatShading
                    />
                </mesh>
            </RigidBody>
        </>
    )
}