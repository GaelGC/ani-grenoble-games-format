import { parseLocalFileLambda, parseWithVersion } from './helpers'
import * as v0 from './oldvers/goose_board_v0'

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
    onWin?: Event;
    onLose?: Event;
}

export type TagSelector = SlotBase & {
    type: 'TagSelector';
    tags: string[]
};

export type TypeSelector = SlotBase & {
    type: 'TypeSelector';
    types: string[]
}

export type Slot = TagSelector | TypeSelector;

const curVer = 1
export type GooseBoard = {
    slots: Slot[];
    winPos: Coordinates;
    version: typeof curVer
};

const v0Schema = parseLocalFileLambda('goose_board_schema_v0.json')
const v1Schema = parseLocalFileLambda('goose_board_schema.json')

const schemas = new Map<number | undefined, any>([
    [undefined, v0Schema],
    [1, v1Schema]
])

function v0Tov1 (val: v0.GooseBoard): GooseBoard {
    function slotV0toV1 (old: v0.Slot): Slot {
        const common = { pos: old.coordinates }
        switch (old.type) {
        case 'TagSelector': {
            return { ...common, type: old.type, tags: old.tags }
        }
        case 'TypeSelector': {
            return { ...common, type: old.type, types: old.types }
        }
        }
    }
    const outVal: GooseBoard = {
        slots: val.slots.map(slotV0toV1),
        winPos: val.winCoordinates,
        version: 1
    }

    return outVal
}

const updaters = new Map<(number | undefined), (val: any) => any>([
    [undefined, v0Tov1]
])

export const parseGooseBoard = (json: string) => parseWithVersion<GooseBoard>(json, schemas, updaters, curVer)
