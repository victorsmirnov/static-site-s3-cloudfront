[![License](https://badgen.net/github/license/victorsmirnov/static-site-s3-cloudfront)](https://github.com/victorsmirnov/static-site-s3-cloudfront/blob/master/LICENSE.md)
[![TS-Standard - Typescript Standard Style Guide](https://badgen.net/badge/code%20style/ts-standard?icon=typescript)](https://github.com/standard/ts-standard)

# CDK script to deploy the static site to S3 and CloudFront

The project is a companion to the [tutorial][1] on my blog.

We will implement infrastructure for the static website with the following features.

* Host website on [Amazon S3][2] private bucket.
* Use [Amazon CloudFront][3] CDN in front of the website to cache the site data and send security headers.
* Support both HTTPS and HTTP protocols with an automatic redirect from HTTP to HTTPS.
* Use [AWS CDK][4] to define and deploy the infrastructure.
* Automatically update the infrastructure and deploy the website with [GitHub actions][5].

We guide you through the development process. Every Git commit adds a slight change to the application,
and we use tags to show milestones.

We add the first commit to emphasise the importance of the readme file for a project.

[1]: https://victorsmirnov.blog/static-s3-site-cloudfront/
[2]: https://aws.amazon.com/s3/
[3]: https://aws.amazon.com/cloudfront/
[4]: https://aws.amazon.com/cdk/
[5]: https://github.com/features/actions
