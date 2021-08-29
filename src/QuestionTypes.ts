import Ajv from 'ajv'
import { Result, Ok, Err } from 'ts-results'
import fs = require('fs');

export interface QuestionBase<TypeName> {
    type: TypeName;
    name: string;
    points: number;
};

export interface ClearAnswerQuestion {
    answer: string;
    hints: string[];
}

export interface BlindTestQuestion extends QuestionBase<'BlindTestQuestion'>, ClearAnswerQuestion {
    path: string;
};

export interface QuoteQuestion extends QuestionBase<'QuoteQuestion'>, ClearAnswerQuestion {
    audio?: string;
    text: string;
};

export interface TextQuestion extends QuestionBase<'TextQuestion'>, ClearAnswerQuestion {
    question: string;
};

export interface HangedManQuestion extends QuestionBase<'HangedManQuestion'>, ClearAnswerQuestion {
};

export type Question = BlindTestQuestion | TextQuestion | QuoteQuestion | HangedManQuestion;

export interface QuestionSet {
    questions: Question[];
};

const schema = JSON.parse(fs.readFileSync(`${__dirname}/question_schema.json`).toString())

export function parseQuestions (json: string): Result<QuestionSet, Error> {
    const ajv = new Ajv()
    let val: unknown
    try {
        val = JSON.parse(json)
        if (ajv.validate(schema, val)) {
            return Ok(val as QuestionSet)
        } else {
            return Err(new Error(ajv.errors!.join('\n')))
        }
    } catch (e) {
        return Err(e)
    }
}
