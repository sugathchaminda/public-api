# qvalia-serverless-public-api

A Lambda project to handle ALB requests for Qvalia UBL based Public API

## Offline Usage

To get the project running locally you should do the following:

1. Make sure you have node installed (preferably using nvm): see: [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)
2. Make sure you can run docker locally. ex for osx and windows you can use the desktop app: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
3. Clone this repository. `git clone git@github.com:Qvalia/qvalia-serverless-public-api.git`
4. CD into the new local repo. `cd qvalia-serverless-public-api`
5. Make sure you are using the node version specified in `.nvmrc` if using nvm run `nvm use`
6. Install all dependencies. `npm install`
7. Start the docker services using docker compose. `docker compose up`
8. Open a new terminal window and start serverless offline. `npm start`
9. Open a new terminal window and ensure everything is running as expected by running integration tests: `npm run integration`
10. Run migrations on the database (the integration tests does this as well, but to double-check that they are applied :)) `knex migrate:latest`
11. Generate a local access-key for the test session using (`<REGNO>` and `<PARTY>` are supplied as params and should match what you plan to use when testing): `npm run create-local-access-key -- <REGNO> <PARTY>`
12. Now you can test the api manually on `http://localhost:3001`(remember to set the `Authorization` header using the access key from step 10).

Note: integration tests and local env is the same, so running integration tests will effectively clean the database since we want the tests to be predictable. Because there is almost no state keeping in the db I think that this is fine for now, no need to keep test data for any longer periods of time. If wee need it we should write seeds for it that one can run.

Note: If you get permission errors when the api is calling the validation function in the external lambda your local aws-profile might not have the correct permissions. You can run the offline app using the url-based(public endpoint) based validation by setting the env variable `USE_URL_VALIDATION`

## Integration tests

The integration tests require the local/offline application to be running see [Offline Usage](#Offline-usage).
To run integration tests run `npm run integration`

## Unit tests

Unit tests do not require the local env to be running, as oposed to integration tests. To run the tests run `npm test`

## Docker and localstack

We emulate the external services that the app use localy with docker. This is done using localstack [https://github.com/localstack/localstack](https://github.com/localstack/localstack) and separate containers for the aurora-db (since that requires pro version of localstack :))    
    
In order for everything to work we need to set up the resources in localstack by hand(since we are not deploying to localstack -> no cloudformation). This is done using bash scripts located in the `/aws` folder that are mounted into the `/docker-entrypoint-initaws.d` folder in the localstack container. These are run by default when starting localstack in alphabetical order. The scripts use `awslocal` instead of the regular `aws` this is a simple wrapper around the aws cli that sets the endpoint to the localstack endpoint when running the commands. so `awslocal s3 cb  ..` == `aws --endpoint http://localhost:4566 s3 db ...` see: [https://github.com/localstack/awscli-local](https://github.com/localstack/awscli-local)  

## Coding style

### Naming conventions
Routes should be directed to their "main" controller, e.g. there is one controller
for incoming invoices (incomingInvoicesController).
Any route that falls under Incoming Invoices should thus use the main controller!

GET operations should use a naming standard as "get{Object}"
POST operations should use a naming standard of "create{Object}"
PUT operations should use a naming standard of "update{Object}"
DELETE operations should use a naming standard of "delete{Object}"

Pluralism is used on the {Object} name if multiple objects are expected
to be returned, e.g. "getInvoices" for listing Invocies but "getInvoice"
for any route returning a specific Invoice only.

### Tests
We should write unit tests for exposed functions that cover the expected input/output. So everything that is exported should be unit tested unless you have a good reason not to. When unit testing it is ok to mock external dependencies, but if a test requires alot of  mocking it might be a sign that the function is doing to much and could be split up into separate units to test. 

We should write integration tests that cover all the expected response codes. Also if some path will call external services (queue, db, s3) that is not covered by the most basic test case we should likely write a test for that as well.

### Other
Most other stuff should be covered by linter. But some recomendations that are not linted are:
* Use arrow style functions unless you have a reason not to. ie `const dostuff = () => {}` instead of `function doStuff() {}`
* When itterating over arrays, there is most of the time a good array method that you can use instead of for-looping.  `.forEach` `.map` `.filter` `.reduce` etc.
* console.log is allowed, but try to only leave logging with path to function in the code that is ready for merge. such as `console.error('api/invoices/outgoing/service/post.js#batchInvoices', err);` instead of `console.log(err)`

## Documentation

We use redoc to generate an html-file from the schema that is specified in `src/docs/schemas/openapi.yaml`. This html file is then served by the lambda function `docs`. To see documentation locally without bundling the html and running the lambda, use the redoc cli. `npx redoc-cli serve ./src/docs/schemas/openapi.yaml`

## CI/CD

The application has a corresponding project in codeship: [https://app.codeship.com/projects/452226](https://app.codeship.com/projects/452226).    

We are using codeship-pro for specifying the integration/deployment pipeline. This means that the configuration is checked in to the repository. The files are:
* `codeship-services.yml` -> specifiec the containers that we use to run tests and deploy.
* `codeship-steps.yml` -> specifies the steps in the ci/cd pipeline.
* `aws.env.encrypted` -> env file containing access credentials for the deployment user.

The deployment user is setup in IAM with a corresponding policy and group for deploying the application:
* user: [codeship-public-api](https://console.aws.amazon.com/iam/home#/users/*codeship-public-api)
* group: [deploy-public-api](https://console.aws.amazon.com/iamv2/home#/groups/details/deploy-public-api)
* policy: [deploy-public-api](https://console.aws.amazon.com/iam/home#/policies$inlineEdit?groupId=deploy-public-api&policyName=deploy-public-api&step=edit)

The policy roughly has the following structure(but for the up to date version refer to the actual policy on aws.)

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "lambda:CreateFunction",
                "iam:ListRoleTags",
                "s3:CreateBucket",
                "iam:CreateRole",
                "lambda:GetFunctionConfiguration",
                "iam:AttachRolePolicy",
                "cloudformation:DescribeStackResource",
                "iam:PutRolePolicy",
                "ssm:GetParameter",
                "logs:ListLogDeliveries",
                "iam:DetachRolePolicy",
                "cloudformation:DescribeStackEvents",
                "cloudformation:UpdateStack",
                "lambda:DeleteFunction",
                "apigateway:GET",
                "cloudformation:ListStackResources",
                "s3:GetBucketPolicyStatus",
                "iam:GetRole",
                "lambda:InvokeFunction",
                "lambda:ListAliases",
                "cloudformation:DescribeStackResources",
                "iam:DeleteRole",
                "ssm:GetParameters",
                "s3:DeleteBucketPolicy",
                "logs:CreateLogGroup",
                "cloudformation:DescribeStacks",
                "lambda:UpdateFunctionCode",
                "s3:PutObject",
                "s3:GetObject",
                "logs:CreateLogDelivery",
                "cloudformation:DeleteStack",
                "lambda:PublishVersion",
                "apigateway:POST",
                "ec2:DescribeSubnets",
                "iam:GetRolePolicy",
                "cloudformation:ValidateTemplate",
                "lambda:ListVersionsByFunction",
                "s3:ListBucket",
                "s3:GetBucketPolicy",
                "s3:PutEncryptionConfiguration",
                "apigateway:DELETE",
                "iam:PassRole",
                "iam:DeleteRolePolicy",
                "logs:DeleteLogDelivery",
                "ssm:GetParametersByPath",
                "s3:DeleteBucket",
                "logs:DescribeLogGroups",
                "apigateway:PUT",
                "logs:DeleteLogGroup",
                "lambda:GetFunction",
                "ssm:GetParameterHistory",
                "lambda:UpdateFunctionConfiguration",
                "ec2:DescribeSecurityGroups",
                "lambda:AddPermission",
                "cloudformation:CreateStack",
                "ec2:DescribeVpcs",
                "s3:PutBucketPolicy",
                "lambda:RemovePermission"
            ],
            "Resource": "*"
        }
    ]
}
```

### Migrations

Migrations in CD are run by invoking the migrator lambda function. This is done as a last step in the CD pipeline. So if deploying manually the migration function needs to be invoked manually as well(if new migrations need to be applied.)

### Gotchas.

* When running integration tests on codeship we depend on the localstack container to be ready. In order to ensure this the integration test command is wrapped with the `wait-for-it.sh` bash script to ensure that the localstack endpoint is available. More info about the script can be found at: [https://github.com/vishnubob/wait-for-it](https://github.com/vishnubob/wait-for-it)
* The integration tests requires that serverless-offline is running in the same container. Offline is started in the test setup when the env variable `RUN_SLS_OFFLINE_IN_INTEGRATION_TEST` is set.
* The precompiled ajv validation creates memory-issues with jest running the unit-tests therefore we use an on demand compiled version when running the unit-tests in CI see: `src/libs/schemaValidators`
* Docs are generated in cd and the bundled html-file is placed in the dir `/dist` this dir is a docker volume so that the deploy deploys the created html for the docs. see codeship-step: `bundle-redoc` and `npm run bundle-docs`
