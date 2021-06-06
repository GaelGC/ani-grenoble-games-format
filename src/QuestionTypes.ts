import Ajv from "ajv";
import { Result, Ok, Err } from "ts-results";
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

export interface BlindTestQuestion extends QuestionBase<"BlindTestQuestion">, ClearAnswerQuestion {
    path: string;
};

export interface TextQuestion extends QuestionBase<"TextQuestion">, ClearAnswerQuestion {
    question: string;
};

export type Question = BlindTestQuestion | TextQuestion;

export interface QuestionSet {
    questions: Question[];
};

const schema = JSON.parse(fs.readFileSync(`${__dirname}/schema.json`).toString());

export function parse(json: string): Result<QuestionSet, Error> {
    const ajv = new Ajv();
    var val: unknown;
    try {
        val = JSON.parse(json);
        if (ajv.validate(schema, val)) {
            return Ok(val as QuestionSet);
        } else {
            return Err(new Error(ajv.errors!.join('\n')));
        }
    } catch (e) {
        return Err(e);
    }
}