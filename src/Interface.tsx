import { useKeyboardControls } from "@react-three/drei"
import useGame, { GameState } from "./stores/useGame"
import { useRef, useEffect, useState } from "react"
import { addEffect } from "@react-three/fiber"
import ModalContainer from "./MenuModal";
import { motion } from "framer-motion";

export default function Interface() {
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [isShowHelpers, setIsShowHelpers] = useState(false);

    const { wall, spinner, limbo } = useGame((state) => state.types)

    const [types, setTypes] = useState<GameState['types']>({
        wall,
        spinner,
        limbo,
    });

    const updateTypes = (newTypes: Partial<GameState['types']>) => {
        const types_ = {
            ...types,
            ...newTypes,
        }

        if (
            Object.values(types).filter(Boolean).length === 1 &&
            Object.values(types_).filter(Boolean).length < 1
        ) return;

        setTypes(types_)
    };

    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)
    const jump = useKeyboardControls((state) => state.jump)
    const menu = useKeyboardControls((state) => state.menu)


    const restart = useGame((state) => state.restart);
    const updateTypes_ = useGame((state) => state.updateTypes);
    const phase = useGame((state) => state.phase);

    const time = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const unsubscribeEffect = addEffect(() => {
            const state = useGame.getState();

            let elapsedTime = 0;
            if (state.phase === 'playing') {
                elapsedTime = Date.now() - state.startTime;
            } else {
                elapsedTime = state.endTime - state.startTime;
            }
            elapsedTime /= 1000;
            const fixedElapsedTime = elapsedTime.toFixed(2);

            if (time.current) {
                time.current.textContent = fixedElapsedTime;
            }
        })

        return () => {
            unsubscribeEffect();
        }
    }, [])

    useEffect(() => {
        if (menu) {
            if (isOpenMenu) {
                setIsOpenMenu(false);
            } else {
                setIsOpenMenu(true);
            }
        }
    }, [menu])

    const handleOpenMenu = () => {
        setIsOpenMenu(true);
    }

    const handleRestart = () => {
        restart();
        setIsOpenMenu(false);
    }

    const setIsOn = (value: boolean) => {
        setIsShowHelpers(value)
    }

    const handleSaveMenu = () => {
        setIsOpenMenu(false);
        updateTypes_(types);
    }

    const handleCloseMenu = () => {
        setIsOpenMenu(false);
        setTypes({ wall, spinner, limbo });
    }
    return (
        <div className="interface">
            <div className="menu" onClick={handleOpenMenu}>
                Menu
            </div>

            <div className="time" ref={time}>0.00</div>

            {phase === 'ended' && <div className="restart" onClick={restart}>Restart</div>}

            {isShowHelpers
                ? <div className="controls">
                    <div className="raw">
                        <div className={`key ${forward ? 'active' : ''}`}></div>
                    </div>
                    <div className="raw">
                        <div className={`key ${leftward ? 'active' : ''}`}></div>
                        <div className={`key ${backward ? 'active' : ''}`}></div>
                        <div className={`key ${rightward ? 'active' : ''}`}></div>
                    </div>
                    <div className="raw">
                        <div className={`key large ${jump ? 'active' : ''}`}></div>
                    </div>
                </div>
                : null
            }

            <ModalContainer visible={isOpenMenu}>
                <div className="modal-menu">
                    <h1 className="modal-menu-header">Menu</h1>

                    <section className="modal-menu-options">
                        <div className="modal-menu-option" onClick={handleRestart}>Restart</div>

                        <div className="modal-menu-option">
                            <div>
                                Helpers
                            </div>
                            <Switch {...{ isOn: isShowHelpers, setIsOn, scale: 0.6 }} />
                        </div>

                        <div className="modal-menu-option">
                            <div>
                                Wall obstacles
                            </div>
                            <Switch {...{
                                isOn: types.wall, setIsOn: () => {
                                    updateTypes({
                                        wall: !types.wall,
                                    })
                                }, scale: 0.6
                            }} />
                        </div>

                        <div className="modal-menu-option">
                            <div>
                                Spinner obstacles
                            </div>
                            <Switch {...{
                                isOn: types.spinner, setIsOn: () => {
                                    updateTypes({
                                        spinner: !types.spinner,
                                    })
                                }, scale: 0.6
                            }} />
                        </div>

                        <div className="modal-menu-option">
                            <div>
                                Limbo obstacles
                            </div>
                            <Switch {...{
                                isOn: types.limbo, setIsOn: () => {
                                    updateTypes({
                                        limbo: !types.limbo,
                                    })
                                }, scale: 0.6
                            }} />
                        </div>
                    </section>

                    <section className="modal-menu-buttons">
                        <div className="modal-menu-close" onClick={handleCloseMenu}>Close</div>
                        <div className="modal-menu-close" onClick={handleSaveMenu}>Save</div>
                    </section>
                </div>
            </ModalContainer>
        </div>
    )
}

interface SwitchProps {
    isOn: boolean;
    setIsOn: (value: boolean) => void;
    // setIsOn: Dispatch<SetStateAction<boolean>>;
    scale?: number;
}

export function Switch({ isOn, setIsOn, scale = 0.8 }: SwitchProps) {

    const toggleSwitch = () => setIsOn(!isOn);

    return (
        <div
            onClick={toggleSwitch}
            style={{
                width: 80 * scale,
                pointerEvents: 'auto',
                height: 40 * scale,
                backgroundColor: isOn ? '#fff' : '#000',
                display: 'flex',
                justifyContent: isOn ? 'flex-end' : 'flex-start',
                borderRadius: 50 * scale,
                padding: 10 * scale,
                boxShadow: '0px 0px 30px #000',
                cursor: 'pointer',
            }}
        >
            <motion.div
                style={{
                    width: 40 * scale,
                    height: 40 * scale,
                    backgroundColor: isOn ? 'black' : 'white',
                    borderRadius: 20 * scale,
                }}
                layout
                transition={{
                    type: "spring",
                    stiffness: 700,
                    damping: 30
                }}
            />
        </div>
    );
}
