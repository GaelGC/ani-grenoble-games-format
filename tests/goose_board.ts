/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { describe, it } from 'mocha'
import * as v0 from '../src/oldvers/goose_board_v0'
import * as v1 from '../dist/goose_board'

const v0Board: v0.GooseBoard = {
    slots: [
        { type: 'TagSelector', tags: ['a'], coordinates: { x: 4, y: 5 } },
        { type: 'TypeSelector', types: ['b'], coordinates: { x: 40, y: 50 } }
    ],
    winCoordinates: {
        x: 9,
        y: 9
    }
}

const v1Board: v1.GooseBoard = {
    slots: [
        { type: 'TagSelector', tags: ['a'], pos: { x: 4, y: 5 } },
        { type: 'TypeSelector', types: ['b'], pos: { x: 40, y: 50 } }
    ],
    winPos: {
        x: 9,
        y: 9
    },
    version: 1
}

describe('Valid goose boards', () => {
    it('v0', () => {
        const json = JSON.stringify(v0Board)
        const result = v1.parseGooseBoard(json)
        expect(result.ok).to.be.true
        expect(result.val).eql(v1Board)
    })

    it('v1', () => {
        const json = JSON.stringify(v1Board)
        const result = v1.parseGooseBoard(json)
        expect(result.ok).to.be.true
        expect(result.val).eql(v1Board)
    })
})
