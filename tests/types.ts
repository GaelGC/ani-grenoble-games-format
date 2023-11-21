import { expect } from 'chai'
import { describe, it } from 'mocha'
import { BlindTestQuestion, Question, QuestionSet, TextQuestion, parseQuestions } from '../dist/question_types'

function expectFailure (s: string) {
    const result = parseQuestions(s)
    // eslint-disable-next-line no-unused-expressions
    expect(result.err).to.be.true
}

function valid (questions: Question[]) {
    const questionSet: QuestionSet = {
        questions,
        configuration: {
            playlist: 'random',
            randomSample: false
        }
    }
    const questionSetJson = JSON.stringify(questionSet)
    const result = parseQuestions(questionSetJson)
    expect(result.val).eql(questionSet)
}

describe('Invalid question sets', () => {
    // Invalid general structure
    it('empty array', () => expectFailure('[]'))
    it('invalid JSON', () => expectFailure('zefez'))
    it('questions as a string', () => expectFailure('{"questions": ["d"]}'))
    it('invalid question type', () => expectFailure('{"questions": [{' +
        '"type": "NotABlindTestQuestion",' +
        '"name": "name",' +
        '"points": 1,' +
        '"hints": [],' +
        '"path": "path"' +
        '}]}'))
    it('missing path property', () => expectFailure('{"questions": [{' +
        '"type": "BlindTestQuestion",' +
        '"name": "name",' +
        '"points": 1,' +
        '"hints": []' +
        '}]}'))
    it('Wrong question type', () => expectFailure('{"questions": [{' +
        '"type": "TextQuestion",' +
        '"name": "name",' +
        '"points": 1,' +
        '"hints": [],' +
        '"path": "path"' +
        '}]}'))
})

describe('Valid question sets', () => {
    // Invalid general structure
    const question1: BlindTestQuestion = {
        type: 'BlindTestQuestion',
        name: 'question 1',
        points: 1,
        hints: ['2008', 'Silky heart'],
        path: 'silky heart.wav',
        answer: 'Toradora!',
        answerImage: '',
        tags: []
    }
    const question2: TextQuestion = {
        type: 'TextQuestion',
        name: 'question 2',
        points: 1,
        hints: ['Pop team epic'],
        question: 'beef or chicken ?',
        answer: 'beef',
        tags: []
    }
    it('blind test question', () => valid([question1]))
    it('quizz test question', () => valid([question2]))
    it('several test questions', () => valid([question1, question2]))
})
