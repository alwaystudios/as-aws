# as-aws

https://www.npmjs.com/package/@alwaystudios/as-aws

```
yarn add @alwaystudios/as-aws
```

# S3Client

Simple S3Client

```
  const s3Client: S3Client = createS3Client(region, accessKeyId, secret)
  // returns { uploadObject, copyObject, objectExists, deleteObject } promise based functions
```

# DynamoDB

## createDynamoDbTable

```
  await createDynamoDbTable(client)(tableDefinition)
```

## deleteDynamoDbTable

```
  await deleteDynamoDbTable(client)(tableName)
```

## insertDynamoDbItem

```
  await insertDynamoDbItem(docClient)(item, tableName)
```

## getDynamoDbItem

```
  await getDynamoDbItem(docClient)(query)
```

## queryDynamoDb

```
  await queryDynamoDb(docClient)(query)
```
