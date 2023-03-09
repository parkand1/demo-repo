import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import * as logs from '@aws-cdk/aws-logs';

export default class EcsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC for the ECS cluster
    const vpc = new ec2.Vpc(this, 'MyVpc');

    // Create a new Fargate service
    const fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'MyFargateService', {
      cluster: new ecs.Cluster(this, 'MyCluster', {
        vpc,
      }),
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('andwizzle93/camunda/zeebe:latest'),
        containerPort: 80,
        enableLogging: true,
        logDriver: new ecs.AwsLogDriver({
          streamPrefix: 'my-container',
          logGroup: new logs.LogGroup(this, 'MyLogGroup', {
            logGroupName: '/ecs/my-task-def',
            retention: logs.RetentionDays.ONE_WEEK,
          }),
        }),
      },
      desiredCount: 1,
      protocol: elbv2.ApplicationProtocol.HTTP,
      publicLoadBalancer: true,
    });

    // Output the URL of the Fargate service
    new cdk.CfnOutput(this, 'ServiceURL', {
      value: fargateService.loadBalancer.loadBalancerDnsName,
    });
  }
}