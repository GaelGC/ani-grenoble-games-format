import Ajv from 'ajv'
import { Result, Ok, Err } from 'ts-results'
import fs = require('fs');

export interface Player {
    name: string;
    score: number;
};

export interface GameState {
    players: Player[];
};

export interface QuestionWinners {
    players: string[];
    points: number;
}

const playerSchema = JSON.parse(fs.readFileSync(`${__dirname}/player_schema.json`).toString())
const questionWinnersSchema = JSON.parse(fs.readFileSync(`${__dirname}/question_winners_schema.json`).toString())
const gameStateSchema = JSON.parse(fs.readFileSync(`${__dirname}/game_state_schema.json`).toString())

function parse<T> (json: string, schema: any): Result<T, Error> {
    const ajv = new Ajv()
    let val: unknown
    try {
        val = JSON.parse(json)
        if (ajv.validate(schema, val)) {
            return Ok(val as T)
        } else {
            return Err(new Error(ajv.errors!.join('\n')))
        }
    } catch (e) {
        return Err(e)
    }
}

export function parsePlayer (json: string): Result<Player, Error> {
    return parse(json, playerSchema)
}

export function parseGameState (json: string): Result<GameState, Error> {
    return parse(json, gameStateSchema)
}

export function parseQuestionWinners (json: string): Result<QuestionWinners, Error> {
    return parse(json, questionWinnersSchema)
}
