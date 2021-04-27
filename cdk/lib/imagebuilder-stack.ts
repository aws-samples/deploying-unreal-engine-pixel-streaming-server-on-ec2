import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as imagebuilder from '@aws-cdk/aws-imagebuilder';
import * as YAML from 'js-yaml';
import * as fs from 'fs';

interface Props extends cdk.StackProps {
    vpc: ec2.Vpc,
}

export class ImageBuilderStack extends cdk.Stack {

    constructor(scope: cdk.Construct, id: string, props: Props) {
        super(scope, id, props);

        let role = new iam.Role(this, 'UEPSWindowsImageBuilderRole', {
            assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
            managedPolicies: [
                { 'managedPolicyArn': 'arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore' },
                { 'managedPolicyArn': 'arn:aws:iam::aws:policy/EC2InstanceProfileForImageBuilder' },
            ]
        });

        const subnet = props.vpc.publicSubnets[0];
        const sg = new ec2.SecurityGroup(this, 'ImageBuilder-sg', {
            vpc: props.vpc
        })
        sg.addIngressRule(ec2.Peer.anyIpv4(), new ec2.Port({
            // TODO: lock this down
            protocol: ec2.Protocol.ALL,
            stringRepresentation: 'Everything'
        }));

        // image builder

        const dependencyInstallData = YAML.load(fs.readFileSync('resources/AMIDependencyInstall.yaml', 'utf8'));
        const installComponent = new imagebuilder.CfnComponent(this, "UEPSInstallComp", {
            name: "AMIDependencyInstall",
            platform: "Windows",
            version: "0.1.2",
            data: YAML.dump(dependencyInstallData)
        })

        const instanceprofile = new iam.CfnInstanceProfile(this, "UEPSWindowsImageInstanceProfile", {
            instanceProfileName: 'UEPSWindowsImageInstanceProfile',
            roles: [role.roleName]
        })

        const rcp = new imagebuilder.CfnImageRecipe(this, 'UEPSWindowsImageRecipe', {
            name: 'UEPSWindowsImageRecipe',
            version: '1.0.3',
            components: [
                { "componentArn": 'arn:aws:imagebuilder:us-east-1:aws:component/amazon-cloudwatch-agent-windows/1.0.0' },
                { "componentArn": 'arn:aws:imagebuilder:us-east-1:aws:component/chocolatey/1.0.0' },
                { "componentArn": installComponent.attrArn }
            ],
            // Core image should be used for deploying, base is helpful for development debugging
            // parentImage: 'arn:aws:imagebuilder:us-east-1:aws:image/windows-server-2019-english-core-base-x86/x.x.x'
            parentImage: 'arn:aws:imagebuilder:us-east-1:aws:image/windows-server-2019-english-full-base-x86/x.x.x'
        })


        const infraconfig = new imagebuilder.CfnInfrastructureConfiguration(this, "UEPSWindowsImageInfrastructureConfig", {
            name: "UEPSWindowsImageInfrastructureConfig",
            instanceTypes: ["m5.xlarge"],
            instanceProfileName: "UEPSWindowsImageInstanceProfile",
            subnetId: subnet.subnetId,
            securityGroupIds: [sg.securityGroupId]
        })
        infraconfig.addDependsOn(instanceprofile);

        const pipeline = new imagebuilder.CfnImagePipeline(this, "UEPSWindowsImagePipeline", {
            name: "UEPSWindowsImagePipeline",
            imageRecipeArn: rcp.attrArn,
            infrastructureConfigurationArn: infraconfig.attrArn
        })
        pipeline.addDependsOn(rcp);
        pipeline.addDependsOn(infraconfig)

    }
}
