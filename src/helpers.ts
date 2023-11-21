import Ajv from 'ajv'
import { Err, Ok, Result } from 'ts-results'
import fs = require('fs')
import path = require('path')

export function parse<T> (json: string, schema: any): Result<T, Error> {
    const ajv = new Ajv({ useDefaults: true })
    let val: unknown
    try {
        val = JSON.parse(json)
        if (ajv.validate(schema, val)) {
            return Ok(val as T)
        } else {
            return Err(new Error(ajv.errorsText(ajv.errors)))
        }
    } catch (e) {
        return Err(<Error>e)
    }
}

const parseLambda = path => JSON.parse(fs.readFileSync(path).toString())
export const parseLocalFileLambda = name => parseLambda(path.join(__dirname, name))
