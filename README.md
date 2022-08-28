[![License](https://badgen.net/github/license/victorsmirnov/static-site-s3-cloudfront)](https://github.com/victorsmirnov/static-site-s3-cloudfront/blob/master/LICENSE.md)
[![TS-Standard - Typescript Standard Style Guide](https://badgen.net/badge/code%20style/ts-standard?icon=typescript)](https://github.com/standard/ts-standard)

# CDK script to deploy the static site to S3 and CloudFront

## Overview

The project is a companion to the [tutorial][1] on my blog.

We will implement infrastructure for the static website with the following features.

* Host website on [Amazon S3][2] private bucket.
* Use [Amazon CloudFront][3] CDN in front of the website to cache the site data and send security headers.
* Support both HTTPS and HTTP protocols with an automatic redirect from HTTP to HTTPS.
* Use [AWS CDK][4] to define and deploy the infrastructure.
* Automatically update the infrastructure and deploy the website with [GitHub actions][5].

We guide you through the development process. Every Git commit adds a slight change to the application,
and we use tags to show milestones.

## Prerequisites

We deploy the website in the Amazon AWS public cloud. If you want to follow the tutorial,
you might want to create an AWS account. The [getting started guide][6] or the [CDK Workshop prerequisites][7]
section contains everything you need to know.

Please find below a checklist with prerequisites to perform the tutorial.
- [ ] Create an IAM user for the AWS account.
- [ ] Set up AWS CLI and register the user's credentials with it.
- [ ] Install NodeJs on your computer. I recommend the latest stable version (LTS), which is now 16.17.0.
- [ ] Register DNS zone for website's domain in the [AWS Route 53][8].

## Initial CDK application

In the first noteworthy commit, we create a minimalistic CDK application. And it looks something like this.

![Project layout](docs/initial-cdk-layout.png)

* `.husky` contains a GitHook definition to check code formatting on commit.
* `cdk.out` is the folder where the CDK application keeps its generated code.
* `dist` is the out directory for the TypeScript compiler, and the CDK application takes scripts from there.
* `src/main.ts` is the entry point for the CDK application. Please keep in mind that we compile
  the TypeScript code first. Then we run the JavaScript code from the `dist` folder.
* `src/site-stack.ts` holds our stack definition.
* `cdk.json` tells the toolkit how to run the application. In our case, it instructs the toolkit to compile
  the application and run the JavaScript code.

At the moment, we should be able to deploy our application.

![First deployment](docs/first-deployment.png)

* `npm run build` compile TypeScript from the `src` folder to JavaScript in the `dist` folder.
* `npx cdk diff` compare deployed stack with the current state.
* `npx cdk deploy` deploy this stack to the default AWS account and region from the default profile.
* `npm run clean` removes all compiled JavaScript code and generated CDK templates.
* `npm run format` fixes source code formatting and checks the code for the coding standard.
* `npm run test` does not do any test but only validates code formatting.


[1]: https://victorsmirnov.blog/static-s3-site-cloudfront/
[2]: https://aws.amazon.com/s3/
[3]: https://aws.amazon.com/cloudfront/
[4]: https://aws.amazon.com/cdk/
[5]: https://github.com/features/actions
[6]: https://aws.amazon.com/getting-started/guides/setup-environment/
[7]: https://cdkworkshop.com/15-prerequisites.html
[8]: https://aws.amazon.com/route53/
