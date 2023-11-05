import { create } from "zustand";
import { subscribeWithSelector } from 'zustand/middleware'

export interface GameState {
    blocksCount: number;
    blocksSeed: number;
    startTime: number;
    endTime: number;
    phase: 'playing' | 'ready' | 'ended';

    types: {
        wall: boolean,
        spinner: boolean,
        limbo: boolean,
    };

    start: () => void;
    restart: () => void;
    end: () => void;
    updateTypes: (newTypes: Partial<GameState['types']>) => void;
}

export default create<GameState>()(
    subscribeWithSelector(
        (set) => {
            return {
                blocksCount: 20,
                blocksSeed: 0,
                phase: 'ready',

                startTime: 0,
                endTime: 0,
                types: {
                    wall: true,
                    spinner: true,
                    limbo: true,
                },

                updateTypes: (newTypes: Partial<GameState['types']>) => {
                    set((state) => {
                        const types = {
                            ...state.types,
                            ...newTypes,
                        }

                        if (
                            Object.values(state.types).filter(Boolean).length === 1 &&
                            Object.values(types).filter(Boolean).length < 1
                        ) return {};

                        return {
                            types
                        };
                    })
                },

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