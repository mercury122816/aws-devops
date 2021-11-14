#!/bin/bash
mkdir /tmp/ssm
curl https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm -o /tmp/ssm/amazon-ssm-agent.rpm
sudo yum install -y /tmp/ssm/amazon-ssm-agent.rpm
sudo systemctl stop amazon-ssm-agent
# edit the code, id and region in the command below
sudo amazon-ssm-agent -register -code "o/bQ/0KMiUvqPdzMxH55" -id "cdaa41bf-7df0-4904-b94b-3aabfa7e45ed" -region "us-east-1"
sudo systemctl start amazon-ssm-agent