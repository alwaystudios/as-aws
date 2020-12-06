import AWS from 'aws-sdk'
import { EncryptResponse } from 'aws-sdk/clients/kms'

export const createKmsClient = (region: string, accessKeyId: string, secretAccessKey: string) => {
  const client = new AWS.KMS({
    region,
    accessKeyId,
    secretAccessKey,
  })

  const encrypt = (keyId: string, bufferData: string): Promise<EncryptResponse> => {
    return new Promise((resolve, reject) => {
      client.encrypt(
        {
          KeyId: keyId,
          Plaintext: bufferData,
        },
        (err, data) => {
          if (err) {
            return reject(err)
          }
          return resolve(data)
        },
      )
    })
  }

  const decrypt = (
    keyId: string,
    ciphertextBlob: string | Buffer | Uint8Array | Blob,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      client.decrypt(
        {
          KeyId: keyId,
          CiphertextBlob: ciphertextBlob,
        },
        (err, data) => {
          if (err) {
            return reject(err)
          }
          const bufferData = data.Plaintext?.toString()
          return resolve(bufferData)
        },
      )
    })
  }

  return { encrypt, decrypt }
}

export type KmsClientType = ReturnType<typeof createKmsClient>
