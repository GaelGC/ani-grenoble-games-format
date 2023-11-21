import { parse, parseLocalFileLambda } from './helpers'

export interface Player {
    name: string;
    score: number;
    color: string;
};

export interface GameState {
    players: Player[];
};

export interface QuestionWinners {
    players: string[];
    points: number;
}

const playerSchema = parseLocalFileLambda('player_schema.json')
export const parsePlayer = (json: string) => parse<Player>(json, playerSchema)

const gameStateSchema = parseLocalFileLambda('game_state_schema.json')
export const parseGameState = (json: string) => parse<GameState>(json, gameStateSchema)

const questionWinnersSchema = parseLocalFileLambda('question_winners_schema.json')
export const parseQuestionWinners = (json: string) => parse<QuestionWinners>(json, questionWinnersSchema)
