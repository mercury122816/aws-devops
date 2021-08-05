const AWS = require('aws-sdk');
const axios = require('axios');
const awsConfig = new AWS.Config({
    region: process.env.AWS_REGION || 'us-east-1'
});
AWS.config.update(awsConfig)
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({ 
    apiVersion: '2018-11-29', 
    endpoint: '0p602gu3qj.execute-api.us-east-1.amazonaws.com/DEV'
});
let response = {
    statusCode: 200
};

exports.lambdaHandler = async (event, context) => {
    try {
        console.log(event);
        console.log(JSON.parse(event.body).Execution)
        const params = {
            TableName: 'receipt_connection_mapping',
            Key: {
                executionId: {
                    S: JSON.parse(event.body).Execution
                }
            }
        };
        console.log(params);
        const data = await ddb.getItem(params).promise();
        console.log(data);
        const connectionId = data.Item.connectionId.S;
        var apiparams = {
            ConnectionId: connectionId,
            Data: JSON.stringify(event)
        };
        const value = await apigatewaymanagementapi.postToConnection(apiparams).promise();
        console.log(value);

    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};
