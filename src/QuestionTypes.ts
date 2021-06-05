import Ajv from "ajv";
import Result = require("ts-result");
import fs = require('fs');

export interface QuestionBase<TypeName> {
    type: TypeName;
    name: string;
    points: number;
    hints: string[];
};

export interface BlindTestQuestion extends QuestionBase<"BlindTestQuestion"> {
    path: string;
};

export interface TextQuestion extends QuestionBase<"TextQuestion"> {
    question: string;
    answer: string;
};

export type Question = BlindTestQuestion | TextQuestion;

export interface QuestionSet {
    questions: Question[];
};

const schema: string = fs.readFileSync(`${__dirname}/schema.json`).toString();

export function parse(json: string): Result<QuestionSet, Error> {
    const ajv = new Ajv();
    var val: unknown;
    try {
        val = JSON.parse(json);
    } catch (e) {
        return Result.err(e);
    }
    if (ajv.validate(schema, val)) {
        return Result.ok(val as QuestionSet);
    } else {
        return Result.err(new Error(ajv.errors!.join('\n')));
    }
}