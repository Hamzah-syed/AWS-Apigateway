import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apiGw from "@aws-cdk/aws-apigateway";

export class ApiCookiesStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Basic Lambda
    const lambdaFn = new lambda.Function(this, "setCookiesFn", {
      functionName: "setCookiesFn",
      code: lambda.Code.fromAsset("fns"),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
    });

    // Api
    const api = new apiGw.RestApi(this, "setCookiesApi", {
      // handler: lambdaFn,
      apiKeySourceType: apiGw.ApiKeySourceType.HEADER,
      // proxy: false,
      defaultMethodOptions: {
        apiKeyRequired: false,
      },

      deployOptions: { stageName: "prod" },
    });

    const resource = api.root.addResource("signup"); // creating a resource
    addCorsOptions(resource); // adding OPTION for CORS

    // Lambda Integration
    const lambdaIntegration = new apiGw.LambdaIntegration(lambdaFn, {
      proxy: false,
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Origin":
              "'http://localhost:3000'",
            "method.response.header.Set-Cookie":
              "integration.response.body.headers.Set-Cookie",
            "method.response.header.Access-Control-Allow-Credentials": "'true'",
          },
        },
      ],
    });

    // Add POST method
    const method = resource.addMethod("POST", lambdaIntegration, {
      apiKeyRequired: true,

      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Origin": true,
            "method.response.header.Set-Cookie": true,
            "method.response.header.Access-Control-Allow-Credentials": true,
          },
        },
      ],
    });

    // Make a Usage plan
    const plan = api.addUsagePlan("UsagePlan", {
      name: "Easy",
      throttle: {
        rateLimit: 10,
        burstLimit: 2,
      },
    });

    // Generating api key
    const key = api.addApiKey("ApiKey", {
      apiKeyName: "testApiKey",
    });
    // Add api key to the above plan
    plan.addApiKey(key);

    // Add plan to deployement stage
    plan.addApiStage({
      stage: api.deploymentStage,
      throttle: [
        {
          method: method,
          throttle: {
            rateLimit: 10,
            burstLimit: 2,
          },
        },
      ],
    });
  }
}

// Enable cors function
export function addCorsOptions(apiResource: apiGw.IResource) {
  apiResource.addMethod(
    "OPTIONS",
    new apiGw.MockIntegration({
      integrationResponses: [
        {
          statusCode: "200",
          // contentHandling: apiGw.ContentHandling.CONVERT_TO_TEXT,
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers":
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Set-Cookie'",
            "method.response.header.Access-Control-Allow-Origin":
              "'http://localhost:3000'",
            "method.response.header.Access-Control-Allow-Credentials": "'true'",
            "method.response.header.Access-Control-Allow-Methods":
              "'POST,OPTIONS'", // modify this based on methods
          },
        },
      ],
      passthroughBehavior: apiGw.PassthroughBehavior.WHEN_NO_MATCH,
      requestTemplates: {
        "application/json": '{"statusCode": 200}',
      },
    }),
    {
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers": true,
            "method.response.header.Access-Control-Allow-Methods": true,
            "method.response.header.Access-Control-Allow-Credentials": true, // TRUE IF USING COGNITO
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
      ],
    }
  );
}
