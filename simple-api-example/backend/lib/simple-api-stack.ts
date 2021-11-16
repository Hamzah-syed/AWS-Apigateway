import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apiGw from "@aws-cdk/aws-apigateway";

export class SimpleApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Basic Lambda
    const lambdaFn = new lambda.Function(this, "simplePostApi", {
      functionName: "simplePostApi",
      code: lambda.Code.fromAsset("fns"),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
    });

    // Api
    const api = new apiGw.LambdaRestApi(this, "simpleApi", {
      handler: lambdaFn,
      apiKeySourceType: apiGw.ApiKeySourceType.HEADER,
      proxy: false,
      defaultMethodOptions: {
        apiKeyRequired: false,
      },

      deployOptions: { stageName: "prod" },
    });

    const resource = api.root.addResource("branches"); // creating a resource
    addCorsOptions(resource); // adding OPTION for CORS

    // Add Get method
    const method = resource.addMethod("GET", undefined, {
      apiKeyRequired: true,
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
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
            "method.response.header.Access-Control-Allow-Origin": "'*'",
            "method.response.header.Access-Control-Allow-Credentials":
              "'false'",
            "method.response.header.Access-Control-Allow-Methods":
              "'GET,OPTIONS'", // modify this based on methods
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
            // "method.response.header.Access-Control-Allow-Credentials": true, // COGNITO
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
      ],
    }
  );
}
