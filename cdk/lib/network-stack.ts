import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling';

export class NetworkStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc
  public readonly securityGroup: ec2.SecurityGroup
  public readonly loadBalancer: elbv2.ApplicationLoadBalancer

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    this.vpc = new ec2.Vpc(this, 'Vpc');

    this.securityGroup = new ec2.SecurityGroup(this, 'ueps-sg', {
      vpc: this.vpc
    });

    // Create the load balancer in a VPC. 'internetFacing' is 'false'
    // by default, which creates an internal load balancer.
    this.loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'balancer', {
      vpc: this.vpc,
      internetFacing: true,
      securityGroup: this.securityGroup
    });

    // Add a listener and open up the load balancer's security group
    // to the world.
    // const listener = lb.addListener('Listener', {
    //   port: 80,

    //   // 'open: true' is the default, you can leave it out if you want. Set it
    //   // to 'false' and use `listener.connections` if you want to be selective
    //   // about who can access the load balancer.
    //   open: true,
    // });

    // Create an AutoScaling group and add it as a load balancing
    // target to the listener.
    // const asg = new AutoScalingGroup(...);
    // listener.addTargets('ApplicationFleet', {
    //   port: 8080,
    //   targets: [asg]
    // });
  }
}
