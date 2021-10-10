// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({ region: 'us-east-1' });

// Create CloudWatch service object
const cw = new AWS.CloudWatch({ apiVersion: '2010-08-01' });

var count = 0;

exports.lambdaHandler = async (event, context) => {
    console.log(event);
    count++;
    addMetric();
    try {
        // const ret = await axios(url);
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'hello world'
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};

const addMetric = () => {
    const params = {
        MetricData: [
            {
                MetricName: 'PAGES_VISITED',
                Dimensions: [
                    {
                        Name: 'UNIQUE_PAGES',
                        Value: 'URLS'
                    },
                ],
                Unit: 'None',
                Value: count
            },
        ],
        Namespace: 'SITE/TRAFFIC'
    };
    console.log(params)
    cw.putMetricData(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", JSON.stringify(data));
        }
    });
}
