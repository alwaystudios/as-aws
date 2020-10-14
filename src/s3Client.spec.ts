import { createS3Client, S3Client } from './s3Client'
import fs from 'fs'
import util from 'util'
import path from 'path'
const { accessKeyId, secret, region, bucket } = require('../config.json') // eslint-disable-line

const s3Client: S3Client = createS3Client(region, accessKeyId, secret)

const readFile = util.promisify(fs.readFile)

describe('s3 client', () => {
  it('create, copy, deletes S3 objects', async () => {
    const folder = 'test'
    const filename = 's3Client.ts'
    const copiedFilename = 's3Client.copy.ts'
    const file = await readFile(path.join(__dirname, '/s3Client.ts'))
    await s3Client.uploadObject(bucket, folder, filename, file)
    expect(await s3Client.objectExists(bucket, folder, filename)).toBe(true)
    await s3Client.copyObject(bucket, folder, filename, `${folder}/${copiedFilename}`)
    expect(await s3Client.objectExists(bucket, folder, copiedFilename)).toBe(true)
    await s3Client.deleteObject(bucket, `${folder}/${copiedFilename}`)
    await s3Client.deleteObject(bucket, `${folder}/${filename}`)
    expect(await s3Client.objectExists(bucket, folder, copiedFilename)).toBe(false)
    expect(await s3Client.objectExists(bucket, folder, filename)).toBe(false)
  })
})
