import AWS, { S3 } from 'aws-sdk'

export const createS3Client = (region: string, accessKeyId: string, secretAccessKey: string) => {
  const client = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey,
  })

  const uploadObject = async (
    bucket: string,
    folder: string,
    filename: string,
    data: any,
  ): Promise<any> =>
    client
      .putObject({
        Bucket: bucket,
        Key: `${folder}/${filename}`,
        Body: data,
      })
      .promise()

  const objectExists = async (bucket: string, folder: string, filename: string) => {
    const params: S3.HeadObjectRequest = {
      Bucket: bucket,
      Key: `${folder}/${filename}`,
    }
    return client
      .headObject(params)
      .promise()
      .then(() => true)
      .catch(({ code }) => {
        if (code === 'NotFound') {
          return false
        }
        throw Error(code)
      })
  }

  const copyObject = async (
    bucket: string,
    folder: string,
    filename: string,
    destination: string,
  ): Promise<void> => {
    const params = {
      Bucket: bucket,
      CopySource: `/${bucket}/${folder}/${filename}`,
      Key: destination,
    }
    await client.copyObject(params).promise()
  }

  const deleteObject = async (bucket: string, target: string): Promise<void> => {
    const params = {
      Bucket: bucket,
      Key: target,
    }
    await client.deleteObject(params).promise()
  }

  return { uploadObject, copyObject, objectExists, deleteObject }
}

export type S3Client = ReturnType<typeof createS3Client>
