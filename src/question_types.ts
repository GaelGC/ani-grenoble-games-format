import { GameConfiguration, setGameConfigurationDefaults } from './configuration'
import { parse, parseLocalFileLambda } from './helpers'

type PartialQuestionBase = {
    name?: string;
    points?: number;
    tags?: string[];
};

export type QuestionBase = Required<PartialQuestionBase>

type PartialClearAnswerQuestion = {
    answer: string;
    hints?: string[];
} & PartialQuestionBase;

export type ClearAnswerQuestion = Required<PartialClearAnswerQuestion> & QuestionBase;

type PartialBlindTestQuestion = PartialClearAnswerQuestion & {
    type: 'BlindTestQuestion';
    path: string;
    answerImage: string;
    tag?: string;
};

type PartialQuoteQuestion = PartialClearAnswerQuestion & {
    type: 'QuoteQuestion';
    audio?: string;
    text: string;
};

type PartialTextQuestion = PartialClearAnswerQuestion & {
    type: 'TextQuestion';
    question: string;
};

type PartialHangedManQuestion = PartialClearAnswerQuestion & {
    type: 'HangedManQuestion';
};

type PartialFindTheWordQuestion = PartialClearAnswerQuestion & {
    type: 'FindTheWordQuestion';
    nbTries: number;
};

type PartialImagesQuestion = PartialClearAnswerQuestion & {
    type: 'ImagesQuestion';
    images: string[];
};

type PartialQuestion = PartialBlindTestQuestion | PartialTextQuestion
                    | PartialQuoteQuestion | PartialHangedManQuestion
                    | PartialImagesQuestion | PartialFindTheWordQuestion;

export type BlindTestQuestion = ClearAnswerQuestion & PartialBlindTestQuestion;
export type QuoteQuestion = ClearAnswerQuestion & PartialQuoteQuestion;
export type TextQuestion = ClearAnswerQuestion & PartialTextQuestion;
export type HangedManQuestion = ClearAnswerQuestion & PartialHangedManQuestion;
export type FindTheWordQuestion = ClearAnswerQuestion & PartialFindTheWordQuestion;
export type ImagesQuestion = ClearAnswerQuestion & PartialImagesQuestion;

export type Question = BlindTestQuestion | TextQuestion | QuoteQuestion
                    | HangedManQuestion | ImagesQuestion | FindTheWordQuestion;

function setQuestionDefault (q: PartialQuestion): Question {
    const def = {
        hints: [],
        name: q.type,
        points: 1,
        tags: []
    }

    return {
        ...def,
        ...q
    }
}

type PartialQuestionSet = {
    questions: PartialQuestion[];
    configuration?: GameConfiguration;
}

export type QuestionSet = {
    questions: Question[];
    configuration: GameConfiguration;
} & PartialQuestionSet;

function setQuestionSetDefaults (qs: PartialQuestionSet): QuestionSet {
    const questions: Question[] = qs.questions.map(q => setQuestionDefault(q))
    const configuration: GameConfiguration = setGameConfigurationDefaults(qs.configuration ?? {})
    return {
        configuration, questions
    }
}

const schema = parseLocalFileLambda('question_schema.json')
export const parseQuestions = (json: string) => parse<PartialQuestionSet>(json, schema).map(x => setQuestionSetDefaults(x))
