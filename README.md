<h1 align="center">
  <p align="center">
    <img src="diagrams/icon.png" height="28" width="28" alt="icon">
    Pecuniary
  </p>
</h1>

<p align="center">
   <a href="https://github.com/eric-bach/pecuniary/actions/workflows/deploy.yml">
      <img src="https://github.com/eric-bach/pecuniary/actions/workflows/deploy.yml/badge.svg" alt="Github"/>
   </a>
   <a href="https://www.codefactor.io/repository/github/eric-bach/pecuniary"><img src="https://www.codefactor.io/repository/github/eric-bach/pecuniary/badge" alt="CodeFactor" /></a>
   <a href="https://cypress.io">
   <img src="https://img.shields.io/badge/cypress.io-tests-green.svg?style=flat-square" alt="cypress"/>
   </a>
   <a href="https://gitter.im/pecuniary/community">
      <img src="https://img.shields.io/gitter/room/pecuniary/community" alt="Gitter"/>
   </a>
   <a href="https://github.com/eric-bach/pecuniary/blob/master/LICENSE">
   <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
   </a>
</p>

<p align="center">
  <a href="ARCHITECTURE.md">Architecture</a> |
  <a href="#getting-started">Getting Started</a> |
  <a href="#deployment">Development</a> |
  <a href="#project-resources">Resources</a>
</p>

<h3 align="center">
  Built with event sourcing and CQRS
</h3>

<p align="center">
  An event-driven serverless microservices application built with <a href="https://nodejs.org">Node.js</a>
</p>

![Top Level](diagrams/toplevel.jpg)

# Getting Started

This quick start guide describes how to get the application running. An `AWS account` is required to deploy the infrastructure required for this project.

1. Clone project and install dependencies

   ```bash
   $ git clone https://github.com/eric-bach/pecuniary.git
   $ cd pecuniary
   $ cd backend && npm install
   $ cd ../client && npm install
   ```

2. Copy the `./backend/deploy-cdk.ps1.example` file to `./backend/deploy-cdk.ps1` and replace `AWS_PROFILE` in the file with your AWS credentials profile name

   ```
   # Deploy CDK
   $ cmd.exe /c cdk deploy --profile AWS_PROFILE pecuniary-dev
   ```

3. Copy the `./backend/.env.example` file to `./backend/.env` and fill in the parameter values:

   - `CERTIFICATE_ARN` - ARN to ACM Certificate for CloudFront Distribution
   - `DLQ_NOTIFICATIONS` - email address to send failed event message notifications to
   - `ALPHA_VANTAGE_API_KEY` - AlphaVantage API key to lookup quotes (sign up for one [here](https://www.alphavantage.co))

4. (optional) Deploy the backend in preparation for step 5111111111111111111111111111111111111111111111111111111111111111111111

5. Copy the `./client/src/aws-exports.js.example` file to `./client/src/aws-exports.js` and fill in the parameter values (use dummy values until the backend is first deployed):

   - aws_project_region: AWS Region,
   - aws_cognito_region: AWS Cognito Region,
   - aws_user_pools_id: AWS Cognito User Pool Id
   - aws_user_pools_web_client_id: AWS Cognito User Pool Web Client Id,
   - aws_appsync_graphqlEndpoint: AWS AppSync GraphQL Endpoint

6. Copy the `./client/.env.example` file to `./client/.env` and `./client/.env.prod` and fill in the parameter values from the CDK stack outputs in step 2:

   - `REACT_APP_COGNITO_USER_POOL_ID` - AWS Cognito User Pool Id created in step 2
   - `REACT_APP_COGNITO_CLIENT_ID` - AWS Cognito User Pool client Id created in step 2

7. Start the client locally on http://localhost:3000/

   ```bash
   $ npm start
   ```

# Event Sourcing and CQRS Architecture

For more detailed information about the event-driven nature of the Pecuniary application and it's architecture, please see the [Architecture.md](ARCHITECTURE.md)

# Deployment

## Deployment with CDK CLI

The Pecuniary application consists of the CDK backend and React frontend, each of which has an independent method of deploying.

### Deploy backend via CDK script

1. Bootstrap CDK (one-time only)

   ```
   $ cdk bootstrap aws://{ACCOUNT_ID}/{REGION} --profile {PROFILE_NAME}}
   ```

2. Ensure AWS credentials are up to date. If using AWS SSO, authorize a set of temporary credentials

   ```bash
   aws sso login
   ```

3. Navigate to the `backend` folder

   ```bash
   $ cd backend
   ```

4. Deploy CDK stack using the bootstrap PowerShell script. Alternatively you may run the individual commands within this script manually. This script includes the necessary scaffolding to initialize some lookup data in the DynamoDB database required for the application to run.

   ```bash
   $ ./deploy-cdk.ps1
   ```

### Deploy frontend

1. Navigate to `client` folder

   ```bash
   $ cd client
   ```

2. Deploy CDK stack

   ```bash
   TBA - To be added
   ```

## Deployment via GitHub Actions

1. Create an AWS user with access id/secret to deploy the CDK stack from GitHub Actions. The user should have Administrative rights.

2. Add the following GitHub Secrets to the repository

   ```
   AWS_ACCESS_KEY_ID - AWS access key id (to prod account for backend resources)
   AWS_ACCESS_KEY_SECRET = AWS access key secret (to prod account for backend resources)
   AWS_ACCESS_KEY_ID_IAM - AWS access key id (to iam account for web hosting resources)
   AWS_ACCESS_KEY_SECRET_IAM = AWS access key secret (to iam account for web hosting resources)
   CERTIFICATE_ARN - ARN to ACM certificate for CloudFront Distribution
   DLQ_NOTIFICATIONS - email address to send DLQ messages to
   ALPHA_VANTAGE_API_KEY = AlphaVantage API Key
   ```

# Projects References

Links to additional documentation specific to the Application

## AppSync

- [Saved GraphQL queries/mutations for GraphiQl](docs/GraphQL.md)
- [How to add a new GraphQL API/Command Handler](docs/CommandHandler.md)
- [How to call an authenticated AppSync GraphQL API with Apollo Client](docs/ApolloClient.md)

# Resources

Various links to additional articles/tutorials used to build this application.

## AppSync

- [How to build an authenticated GraphQL AppSync API with CDK](https://github.com/dabit3/build-an-authenticated-api-with-cdk)
- [How to perform a GraphQL Query with Apollo using React hooks](https://www.yannisspyrou.com/querying-app-sync-using-react-hooks)
- [How to perform a GraphQL Mutation with Apollo using React hooks](https://www.qualityology.com/tech/connect-to-existing-aws-appsync-api-from-a-react-application/)

## Cognito

- [How to add a protected route to React](https://dev.to/olumidesamuel_/implementing-protected-route-and-authentication-in-react-js-3cl4)
- [How to authenticate with Cognito using React hooks](https://github.com/DevAscend/YT-AWS-Cognito-React-Tutorials)
- [How to add a user to a Cognito User Group](https://bobbyhadz.com/blog/aws-cognito-add-user-to-group)

# License

This project is licensed under the terms of the [MIT license](/LICENSE).
