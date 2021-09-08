import Ajv from 'ajv'
import { Result, Ok, Err } from 'ts-results'
import fs = require('fs');

export interface SlotBase<TypeName> {
    type: TypeName;
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
};

const schema = JSON.parse(fs.readFileSync(`${__dirname}/goose_board_schema.json`).toString())

export function parseGooseBoard (json: string): Result<GooseBoard, Error> {
    const ajv = new Ajv()
    let val: unknown
    try {
        val = JSON.parse(json)
        if (ajv.validate(schema, val)) {
            return Ok(val as GooseBoard)
        } else {
            return Err(new Error(ajv.errors!.join('\n')))
        }
    } catch (e) {
        return Err(e)
    }
}
