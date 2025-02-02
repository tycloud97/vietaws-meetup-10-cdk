#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { ApiStack } from '../lib/api-stack';
import { CiCdStack } from '../lib/ci-cd-stack';
import { APP_NAME, DEFAULT_VALUES } from '../lib/constants';
import { DatabaseStack } from '../lib/database-stack';
import { FrontendStack } from '../lib/frontend-stack';
import { BaseStackProps, GitHubStackProps } from '../lib/types/StackProps';

const app = new App();

const envName = app.node.tryGetContext('env');
const stage = app.node.tryGetContext('stage');

const baseProps: BaseStackProps = {
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
  appName: APP_NAME,
  envName: envName,
  tags: {
    environment: envName,
    application: APP_NAME,
  },
};

switch (stage) {
  case 'cicd': {
    const gitHubProps: GitHubStackProps = {
      repositoryConfig: [
        {
          owner: DEFAULT_VALUES.GITHUB_OWNER,
          repo: APP_NAME,
        },
      ],
    };
    new CiCdStack(app, `${APP_NAME}-cicd-${envName}`, { ...baseProps, ...gitHubProps });

    break;
  }

  case 'backend': {
    const database = new DatabaseStack(app, `${APP_NAME}-database-${envName}`, baseProps);

    new ApiStack(app, `${APP_NAME}-api-${envName}`, {
      ...baseProps,
      params: {
        ordersTableArn: database.ordersTableArn,
      },
    });

    break;
  }

  case 'frontend': {
    new FrontendStack(app, `${APP_NAME}-frontend-${envName}`, {
      ...baseProps,
      params: {
        certificateArn: process.env.CERTIFICATE_ARN ?? 'not_an_arn',
      },
    });
    break;
  }
}
