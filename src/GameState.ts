import Ajv from "ajv";
import { Result, Ok, Err } from "ts-results";
import fs = require('fs');

export interface Player {
    name: string;
    score: number;
};

export interface GameState {
    players: Player[];
};

const playerSchema = JSON.parse(fs.readFileSync(`${__dirname}/player_schema.json`).toString());
const gameStateSchema = JSON.parse(fs.readFileSync(`${__dirname}/game_state_schema.json`).toString());

function parse<T>(json: string, schema: any): Result<T, Error> {
    const ajv = new Ajv();
    var val: unknown;
    try {
        val = JSON.parse(json);
        if (ajv.validate(schema, val)) {
            return Ok(val as T);
        } else {
            return Err(new Error(ajv.errors!.join('\n')));
        }
    } catch (e) {
        return Err(e);
    }
}

export function parse_player(json: string): Result<Player, Error> {
    return parse(json, playerSchema);
}

export function parse_game_state(json: string): Result<GameState, Error> {
    return parse(json, gameStateSchema);
}