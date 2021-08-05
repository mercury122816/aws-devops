const AWS = require('aws-sdk');
const awsConfig = new AWS.Config({
    region: process.env.AWS_REGION || 'us-east-1'
});
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

let response;

exports.lambdaHandler = async (event, context) => {
    try {
        console.log(event);
        const connectionId = event.requestContext.connectionId;
        const stateExecutionId = JSON.parse(event.body).executionId;
        const params = {
            TableName: 'receipt_connection_mapping',
            Item: {
                'connectionId': { S: connectionId },
                'executionId': { S: stateExecutionId }
            }
        };
        await ddb.putItem(params).promise();
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                status: 'SUCCESS',
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
