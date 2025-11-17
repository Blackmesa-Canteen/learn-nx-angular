import { defineFunction } from '@aws-amplify/backend';

export const coreApiFunction = defineFunction({
  name: "learnCoreApiFunction",
  runtime: 22,
  entry: '../../../src/main.serverless.ts',
});
