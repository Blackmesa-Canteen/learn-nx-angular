import { defineFunction } from '@aws-amplify/backend';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

export const coreApiFunction = defineFunction({
  name: "learnCoreApiFunction",
  runtime: 22,
  entry: '../../../../api/src/main.serverless.ts',
});
