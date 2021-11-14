#!/bin/bash

aws iam create-role --role-name FirehosetoS3Role --assume-role-policy-document file://./TrustPolicyForFirehose.json --profile personal
