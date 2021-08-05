const AWS = require('aws-sdk');
const awsConfig = new AWS.Config({
    region: process.env.AWS_REGION || 'us-east-1'
});
const stepFunction = new AWS.StepFunctions(awsConfig);
let response;

exports.lambdaHandler = async (event) => {
    try {
        const params = {
            stateMachineArn: process.env.EXECUTION_ARN,
            input: JSON.stringify(event)
        };
        const data = await stepFunction.startExecution(params).promise();
        response = {
            'statusCode': 200,
            'body': JSON.stringify({ data })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
