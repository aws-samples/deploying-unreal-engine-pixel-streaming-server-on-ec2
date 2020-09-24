# Deploying Unreal Engine Pixel Streaming Server on EC2

This sample is for those who use Unreal Engine 4 to build content and wish to deploy this content to an audience via UE4 pixel streams. Content examples include but are not limited to: interactive entertainment, architectural visualization, high fidelity car configurators, or anyone who needs to let users access high quality interactive content via thin clients such as web browsers.

## Working with UE4 Pixel Streaming on AWS

Using AWS and Unreal Engine 4’s Pixel Streaming solution, developers can create content with Unreal Engine and deploy on AWS so users can engage with the content from any modern Web browser. A build of the UE4 content is run on an Amazon Elastic Compute Cloud (Amazon EC2) G4 instance. G4 instances are GPU instances that are designed for graphics-intensive workloads and offer a powerful, low-cost, pay-as-you-go model which is ideal for on-demand interactive content.

This Quick Start deployment sets up an EC2 environment on AWS that includes the following:

* [Unreal Engine 4 Pixel Streaming](https://docs.unrealengine.com/en-US/Platforms/PixelStreaming/index.html) components from your pixel streaming build are installed and run on startup. Components include UE4 Windows build with pixel streaming plug-in executable, Stun Server, Turn Server, and Signaling Web Server.
* [Nice DCV](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjegIuN6YLsAhUIna0KHdNXCBwQFjAAegQIAxAB&url=https%3A%2F%2Faws.amazon.com%2Fhpc%2Fdcv%2F&usg=AOvVaw3zloCNRymwGNnFAuD7OP3M) is installed allowing developers to connect to the G4 instance, for a low latency remote desktop experience that supports resolutions up to 4k. This allows a developer to remote in to test the build and optionally installUnreal Engine 4 directly on the machine.

## Deployment Guide

Follow the steps outlined in the [Unreal Engine Pixel Streaming Deployment Guide](Documentation\Unreal-Engine-Pixel-Streaming-Deployment-Guide.pdf). Once deployed the CloudFormation stack will deploy the below architecture:

![Architecture Diagram](Documentation\Unreal-Engine-Pixel-Streaming-Architecture.png)

## Additional Resources

* Unreal Engine Pixel Streaming Documentation - https://docs.unrealengine.com/en-US/Platforms/PixelStreaming/index.html
* Amazon EC2 - https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/
* AWS CloudFormation - https://aws.amazon.com/documentation/cloudformation/

## Security

There are several security-related aspects of the architecture in this sample. The solution is deployed into the default VPC. It creates a security group that allows fine-grained control of traffic in and out of the EC2 hosting the Pixel Streaming server. You can limit access to IP addresses that need to access the host (see the HostAccessCIDR parameter earlier in this guide ). This helps keep the host protected from malicious attacks and helps protect the data (UE4 Pixel Streaming build, in this case).

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
