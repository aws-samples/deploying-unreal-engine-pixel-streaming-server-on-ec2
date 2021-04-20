#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { NetworkStack } from '../lib/network-stack';
import { ImageBuilderStack } from '../lib/imagebuilder-stack';

const app = new cdk.App();
const network = new NetworkStack(app, 'UEPSStack');
new ImageBuilderStack(app, 'UEPSBuilderStack', {
  vpc: network.vpc
})
