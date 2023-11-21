import { GameConfiguration } from './configuration'
import { parse, parseLocalFileLambda } from './helpers'

export interface QuestionBase<TypeName> {
    type: TypeName;
    name: string;
    points: number;
    tags: string[];
};

export interface ClearAnswerQuestion {
    answer: string;
    hints: string[];
};

export interface BlindTestQuestion extends QuestionBase<'BlindTestQuestion'>, ClearAnswerQuestion {
    path: string;
    answerImage: string;
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

export interface FindTheWordQuestion extends QuestionBase<'FindTheWordQuestion'>, ClearAnswerQuestion {
    nbTries: number;
};

export interface ImagesQuestion extends QuestionBase<'ImagesQuestion'>, ClearAnswerQuestion {
    images: string[];
};

export type Question = BlindTestQuestion | TextQuestion | QuoteQuestion
                     | HangedManQuestion | ImagesQuestion | FindTheWordQuestion;

export interface QuestionSet {
    questions: Question[];
    /** @default {} */
    configuration: GameConfiguration;
};

const schema = parseLocalFileLambda('question_schema.json')
export const parseQuestions = (json: string) => parse<QuestionSet>(json, schema)
