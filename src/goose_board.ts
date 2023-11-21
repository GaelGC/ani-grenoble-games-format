import { parse, parseLocalFileLambda } from './helpers'

export type Coordinates = {
    x: number;
    y: number;
}

export interface SlotBase<TypeName> {
    type: TypeName;
    coordinates: Coordinates;
}

export interface TagSelector extends SlotBase<'TagSelector'> {
    tags: string[]
};

export interface TypeSelector extends SlotBase<'TypeSelector'> {
    types: string[]
}

export type Slot = TagSelector | TypeSelector;

export interface GooseBoard {
    slots: Slot[];
    winCoordinates: Coordinates;
};

const schema = parseLocalFileLambda('goose_board_schema.json')
export const parseGooseBoard = (json: string) => parse<GooseBoard>(json, schema)
