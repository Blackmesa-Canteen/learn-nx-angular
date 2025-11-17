import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { coreApiFunction } from './functions/api-function/resource';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { CorsHttpMethod, HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Stack, Tags } from 'aws-cdk-lib';
import { HttpIamAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, custom, and more
 */
const backend = defineBackend({
  auth,
  coreApiFunction,
});

const apiStack = backend.createStack("api-stack");

// create a IAM authorizer
const iamAuthorizer = new HttpIamAuthorizer();

// create a new HTTP Lambda integration
const httpLambdaIntegration = new HttpLambdaIntegration(
  "LambdaIntegration",
  backend.coreApiFunction.resources.lambda,
);

// create a new HTTP API with IAM as default authorizer
const httpApi = new HttpApi(apiStack, "HttpApi", {
  apiName: "myHttpApi",
  corsPreflight: {
    // Modify the CORS settings below to match your specific requirements
    allowMethods: [
      CorsHttpMethod.GET,
      CorsHttpMethod.POST,
      CorsHttpMethod.PUT,
      CorsHttpMethod.DELETE,
    ],
    // Restrict this to domains you trust
    allowOrigins: ["*"],
    // Specify only the headers you need to allow
    allowHeaders: ["*"],
  },
  createDefaultStage: true,
});

// add routes to the API
httpApi.addRoutes({
  path: "/{proxy+}",
  methods: [HttpMethod.ANY],
  integration: httpLambdaIntegration,
  authorizer: iamAuthorizer,
});

// create a new IAM policy to allow Invoke access to the API
const apiPolicy = new Policy(apiStack, "ApiPolicy", {
  statements: [
    new PolicyStatement({
      actions: ["execute-api:Invoke"],
      resources: [
        `${httpApi.arnForExecuteApi("*", "/")}`,
        `${httpApi.arnForExecuteApi("*", "/*")}`,
      ],
    }),
  ],
});

// attach the policy to the authenticated and unauthenticated IAM roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(apiPolicy);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(apiPolicy);

// add outputs to the configuration file
backend.addOutput({
  custom: {
    API: {
      [httpApi.httpApiName!]: {
        endpoint: httpApi.url,
        region: Stack.of(httpApi).region,
        apiName: httpApi.httpApiName,
      },
    },
  },
});

// tags
const tags = Tags.of(backend.stack);
tags.add("project", "angular-demo");
tags.add("environment", "dev");
tags.add("isPdr", "true");

