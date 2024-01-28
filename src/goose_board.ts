import { parseLocalFileLambda, parseWithVersion } from './helpers'
import * as v0 from './oldvers/goose_board_v0'
import * as v1 from './oldvers/goose_board_v1'

export type Coordinates = {
    x: number;
    y: number;
}

export type MoveEvent = {
    nbPos: number;
    text: string;
    movetype: 'relative' | 'absolute';
    type: 'move';
}

export type Event = MoveEvent;

export type SlotBase = {
    pos: Coordinates;
    tile: number;
}

export type GameSlot = SlotBase & {
    type: 'GameSlot';
    onWin?: Event;
    onLose?: Event;
}

export type EventSlot = SlotBase & {
    type: 'EventSlot';
    event: Event;
}

export type TagSelectorSlot = GameSlot & {
    selector: 'TagSelector';
    tags: string[]
};

export type TypeSelectorSlot = GameSlot & {
    selector: 'TypeSelector';
    types: string[]
}

export type Slot = TagSelectorSlot | TypeSelectorSlot | EventSlot;

const curVer = 2
export type GooseBoard = {
    slots: Slot[];
    winPos: Coordinates;
    cellTileSet: string;
    playersTileSet: string;
    version: typeof curVer;
};

const v0Schema = parseLocalFileLambda('goose_board_schema_v0.json')
const v1Schema = parseLocalFileLambda('goose_board_schema_v1.json')
const v2Schema = parseLocalFileLambda('goose_board_schema.json')

const schemas = new Map<number | undefined, any>([
    [undefined, v0Schema],
    [1, v1Schema],
    [2, v2Schema]
])

function v0Tov1 (val: v0.GooseBoard): v1.GooseBoard {
    function slotV0toV1 (old: v0.Slot): v1.Slot {
        const common = { pos: old.coordinates }
        switch (old.type) {
        case 'TagSelector': {
            return { ...common, type: 'GameSlot', selector: old.type, tags: old.tags }
        }
        case 'TypeSelector': {
            return { ...common, type: 'GameSlot', selector: old.type, types: old.types }
        }
        }
    }
    const outVal: v1.GooseBoard = {
        slots: val.slots.map(slotV0toV1),
        winPos: val.winCoordinates,
        version: 1
    }

    return outVal
}

function v1Tov2 (val: v1.GooseBoard): GooseBoard {
    function slotV1toV2 (old: v1.Slot): Slot {
        return {
            ...old,
            tile: 0
        }
    }
    const outVal: GooseBoard = {
        ...val,
        slots: val.slots.map(slotV1toV2),
        cellTileSet: 'ui:///./img/goose_default_tileset.png',
        playersTileSet: 'ui:///./img/goose_default_players_tileset.png',
        version: 2
    }

    return outVal
}

const updaters = new Map<(number | undefined), (val: any) => any>([
    [undefined, v0Tov1],
    [1, v1Tov2]
])

export const parseGooseBoard = (json: string) => parseWithVersion<GooseBoard>(json, schemas, updaters, curVer)
