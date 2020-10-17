import {
  createDynamoDbTable,
  deleteDynamoDbTable,
  insertDynamoDbItem,
  getDynamoDbItem,
  queryDynamoDb,
} from './dynamoDb'
import { createS3Client } from './s3Client'

export {
  createS3Client,
  createDynamoDbTable,
  deleteDynamoDbTable,
  insertDynamoDbItem,
  getDynamoDbItem,
  queryDynamoDb,
}
