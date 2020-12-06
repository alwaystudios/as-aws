import { createKmsClient, KmsClientType } from './kmsClient'

const { dynamoId, dynamoSecret, region } = require('../config.json') // eslint-disable-line

const kmsClient: KmsClientType = createKmsClient(region, dynamoId, dynamoSecret)
const keyId = 'arn:aws:kms:eu-west-1:137374389243:key/e48bf9e2-763e-4557-b6c0-d7acd58a1bbf'

describe('kms client', () => {
  it('encrypts, then decrypts a string', async () => {
    const dataToEncrypt = 'some secret string'

    const response = await kmsClient.encrypt(keyId, dataToEncrypt)
    const blob = response.CiphertextBlob as Blob

    expect(blob?.toString()).not.toEqual(dataToEncrypt)

    const decryptedData = await kmsClient.decrypt(keyId, blob)
    expect(decryptedData).toEqual(dataToEncrypt)
  })
})
