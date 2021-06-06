import { expect } from 'chai';
import { BlindTestQuestion, parse, Question, QuestionSet, TextQuestion } from '../dist/QuestionTypes';
import { describe } from 'mocha'

function except_failure(s: string) {
    const result = parse(s);
    expect(result.err).true;
}

function valid(questions: Question[]) {
    const questionSet: QuestionSet = {
        questions: questions
    };
    const questionSetJson = JSON.stringify(questionSet);
    const result = parse(questionSetJson);
    expect(result.val).eql(questionSet);
}

describe('Invalid question sets', () => {
    // Invalid general structure
    it('empty array', () => except_failure("[]"));
    it('invalid JSON', () => except_failure("zefez"));
    it('questions as a string', () => except_failure('{"questions": ["d"]}'));
    it('invalid question type', () => except_failure('{"questions": [{' +
        '"type": "NotABlindTestQuestion",' +
        '"name": "name",' +
        '"points": 1,' +
        '"hints": [],' +
        '"path": "path"' +
        '}]}'));
    it('missing path property', () => except_failure('{"questions": [{' +
        '"type": "BlindTestQuestion",' +
        '"name": "name",' +
        '"points": 1,' +
        '"hints": []' +
        '}]}'));
    it('Wrong question type', () => except_failure('{"questions": [{' +
        '"type": "TextQuestion",' +
        '"name": "name",' +
        '"points": 1,' +
        '"hints": [],' +
        '"path": "path"' +
        '}]}'));
});

describe('Valid question sets', () => {
    // Invalid general structure
    const question1: BlindTestQuestion = {
        type: "BlindTestQuestion",
        name: "question 1",
        points: 1,
        hints: ["2008", "Silky heart"],
        path: "silky heart.wav",
        answer: "Toradora!"
    };
    const question2: TextQuestion = {
        type: "TextQuestion",
        name: "question 2",
        points: 1,
        hints: ["Pop team epic"],
        question: "beef or chicken ?",
        answer: "beef"
    };
    it('blind test question', () => valid([question1]));
    it('quizz test question', () => valid([question2]));
    it('several test questions', () => valid([question1, question2]));
});