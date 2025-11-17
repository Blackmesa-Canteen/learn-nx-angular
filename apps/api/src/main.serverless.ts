
import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import serverlessExpress from '@codegenie/serverless-express';
import { Handler, Context } from 'aws-lambda';

import { AppModule } from './app/app.module';

const globalPrefix = 'core';

let serverlessExpressInstance: Handler;

async function bootstrapServer(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(globalPrefix);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

async function handler(event: any, context: Context): Promise<any> {
  if (serverlessExpressInstance) {
    return serverlessExpressInstance(event, context, () => {});
  }

  serverlessExpressInstance = await bootstrapServer();
  return serverlessExpressInstance(event, context, () => {});
}

exports.handler = handler;
