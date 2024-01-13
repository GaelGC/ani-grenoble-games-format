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

export function parseWithVersion<T> (json: string,
    schemas: Map<number | undefined, any>,
    converters: Map<number | undefined, (olverJson: any) => any>,
    lastver: number): Result<T, Error> {
    let val: any
    try {
        val = JSON.parse(json)
    } catch (e) {
        return Err(<Error>e)
    }

    const curVer = val.version
    const schema = schemas.get(val.version)
    if (schema === undefined) {
        return Err(Error(`Unable to find a schema for version ${curVer}`))
    }
    const ajv = new Ajv()
    if (!ajv.validate(schema, val)) {
        return Err(new Error(ajv.errorsText(ajv.errors)))
    }

    let converter: ((olverJson: any) => any) | undefined
    while ((converter = converters.get(val.version)) !== undefined) {
        val = converter(val)
    }

    if (val.version !== lastver) {
        return Err(Error(`Unable to go from version ${val.version} to version ${lastver}. Update manually or contact a developer.`))
    }

    return Ok(val as T)
}
