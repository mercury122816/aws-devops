
const REGION = process.env.REGION || 'us-east-1';
const AWS = require('aws-sdk');
AWS.config.update({ region: REGION });

var ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

let response;

exports.lambdaHandler = async (event, context) => {
    try {
        const runningInstances = [];
        const params = {};
        const instances = await ec2.describeInstances(params).promise();
        if(instances && instances.Reservations && instances.Reservations.length > 0) {
            instances.Reservations.forEach((reservation) => {
                if(reservation && reservation.Instances && reservation.Instances.length >0) {
                    reservation.Instances.forEach(instance => {
                        console.log(JSON.stringify(instance));
                        if(instance && instance.State && instance.State.Code && instance.State.Code === 16 ) {
                            runningInstances.push(instance.InstanceId);
                        }
                    });
                }
            });
        }
        if(runningInstances && runningInstances.length > 0) {
            console.log(`Stopping Instances ${JSON.stringify(runningInstances)}`);
            await ec2.stopInstances({
                InstanceIds: runningInstances
            }).promise();
        }
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                state: 'complete'
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
