#!/bin/bash
awslocal dynamodb create-table --cli-input-json file:///docker-entrypoint-initaws.d/dynamodb-create-table.json --region eu-west-1
