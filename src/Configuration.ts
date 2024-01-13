type PartialGameConfiguration = {
    playlist?: 'random' | 'sequential';
    randomSample?: boolean;
};

export type GameConfiguration = Required<PartialGameConfiguration>;

export function setGameConfigurationDefaults (config: PartialGameConfiguration): GameConfiguration {
    const def: GameConfiguration = {
        playlist: 'random',
        randomSample: true
    }
    return {
        ...def,
        ...config
    }
}
