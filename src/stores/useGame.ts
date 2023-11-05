import { create } from "zustand";
import { subscribeWithSelector } from 'zustand/middleware'

interface GameState {
    blocksCount: number;
    blocksSeed: number;
    startTime: number;
    endTime: number;
    phase: 'playing' | 'ready' | 'ended';

    start: () => void;
    restart: () => void;
    end: () => void;
}

export default create<GameState>()(
    subscribeWithSelector(
        (set) => {
            return {
                blocksCount: 3,
                blocksSeed: 0,
                phase: 'ready',

                startTime: 0,
                endTime: 0,

                start: () => {
                    set((state) => {
                        if (state.phase === 'ready') {
                            return {
                                phase: 'playing',
                                startTime: Date.now(),
                            }
                        }
                        return {};
                    })
                },

                restart: () => {
                    set((state) => {
                        if (state.phase === 'playing' || state.phase === 'ended') {
                            return {
                                phase: 'ready',
                                blocksSeed: Math.random(),
                                startTime: 0,
                                endTime: 0,
                            }
                        }
                        return {};
                    })
                },

                end: () => {
                    set((state) => {
                        if (state.phase === 'playing') {
                            return {
                                phase: 'ended',
                                endTime: Date.now(),
                            }
                        }
                        return {};
                    })
                },


            } as GameState
        }
    )
)