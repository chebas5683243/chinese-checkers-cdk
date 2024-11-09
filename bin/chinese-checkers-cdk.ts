#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ChineseCheckersCdkStack } from '../lib/chinese-checkers-cdk-stack';

const app = new cdk.App();
new ChineseCheckersCdkStack(app, 'ChineseCheckersCdkStack');