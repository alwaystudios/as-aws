import { DynamoDB } from 'aws-sdk'
import {
  CreateTableInput,
  DocumentClient,
  GetItemInput,
  GetItemOutput,
  QueryInput,
  QueryOutput,
} from 'aws-sdk/clients/dynamodb'

export const createDynamoDbTable = (client: DynamoDB) => async (
  params: CreateTableInput,
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    client.createTable(params, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

export const deleteDynamoDbTable = (client: DynamoDB) => async (
  table: string,
): Promise<QueryOutput> => {
  const params = { TableName: table }
  return new Promise<QueryOutput>((resolve, reject) => {
    client.deleteTable(params, (err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

export const insertDynamoDbItem = (client: DocumentClient) => async <T>(
  item: T,
  table: string,
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    client.put(
      {
        TableName: table,
        Item: item,
      },
      (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      },
    )
  })
}

export const getDynamoDbItem = (client: DocumentClient) => async (
  params: GetItemInput,
): Promise<GetItemOutput> => {
  return new Promise<GetItemOutput>((resolve, reject) => {
    client.get(params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

export const queryDynamoDb = (client: DocumentClient) => async (
  params: QueryInput,
): Promise<QueryOutput> => {
  return new Promise<QueryOutput>((resolve, reject) => {
    client.query(params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}
