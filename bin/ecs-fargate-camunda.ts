#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import EcsStack from "../lib/ecs-fargate-camunda-stack"

const app = new cdk.App();

const stack = new cdk.Stack(app, 'EcsStack')

// new EcsStack(app, 'EcsStack');