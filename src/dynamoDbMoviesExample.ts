import { promiseTimeout } from '@alwaystudios/as-utils'
import AWS from 'aws-sdk'
import { GetItemInput, QueryInput } from 'aws-sdk/clients/dynamodb'
import fs from 'fs'
import {
  insertDynamoDbItem,
  createDynamoDbTable,
  getDynamoDbItem,
  queryDynamoDb,
  deleteDynamoDbTable,
} from './dynamoDb'
const { dynamoId, dynamoSecret, region } = require('../config.json') // eslint-disable-line

const table = 'Movies'

const config = {
  region,
  accessKeyId: dynamoId,
  secretAccessKey: dynamoSecret,
}

const dynamoDbClient = new AWS.DynamoDB(config)
const dynamoDbDocClient = new AWS.DynamoDB.DocumentClient(config)

const tableDef = {
  TableName: table,
  KeySchema: [
    { AttributeName: 'year', KeyType: 'HASH' }, // partition key
    { AttributeName: 'title', KeyType: 'RANGE' }, // sort key
  ],
  AttributeDefinitions: [
    { AttributeName: 'year', AttributeType: 'N' },
    { AttributeName: 'title', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
}

const onError = (err: any) => {
  console.error(err)
}

Promise.resolve()
  .then(async () => {
    await createDynamoDbTable(dynamoDbClient)(tableDef)
      .then(async () => {
        await promiseTimeout(5000) // wait for provisioning in aws
        const movieData = JSON.parse(fs.readFileSync('moviedata.json', 'utf8'))
        await Promise.all(
          movieData.map((movie: any) => insertDynamoDbItem(dynamoDbDocClient)(movie, table)),
        ).catch(onError)
      })
      .catch(onError)

    const year = 1925
    const title = 'The Big Parade'

    const params = {
      TableName: table,
      Key: {
        year: year,
        title: title,
      },
    } as GetItemInput

    const getData = await getDynamoDbItem(dynamoDbDocClient)(params)
    console.log(JSON.stringify(getData))

    const query = {
      TableName: table,
      KeyConditionExpression: '#yr = :yyyy',
      ExpressionAttributeNames: {
        '#yr': 'year',
      },
      ExpressionAttributeValues: {
        ':yyyy': 1985,
      },
    } as QueryInput

    const queryData = await queryDynamoDb(dynamoDbDocClient)(query)
    console.log(queryData)

    await deleteDynamoDbTable(dynamoDbClient)(table)
  })
  .catch(onError)
