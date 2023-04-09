import { Certificate } from 'aws-cdk-lib/aws-certificatemanager'
import {
  AllowedMethods,
  CachePolicy,
  Distribution,
  HttpVersion,
  OriginRequestPolicy,
  ViewerProtocolPolicy
} from 'aws-cdk-lib/aws-cloudfront'
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { Bucket } from 'aws-cdk-lib/aws-s3'
import { Construct } from 'constructs'

export interface CloudFrontProps {
  readonly certificate: Certificate
  readonly siteBucket: Bucket
  readonly siteName: string
}

export function createCloudFront (scope: Construct, props: CloudFrontProps): Distribution {
  const { certificate, siteBucket, siteName } = props

  const bucketOrigin = new S3Origin(siteBucket, { originPath: '/public' })

  return new Distribution(scope, 'Distribution', {
    certificate,
    comment: `${siteName} static site bucket`,
    defaultBehavior: {
      allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
      cachePolicy: CachePolicy.CACHING_OPTIMIZED,
      origin: bucketOrigin,
      originRequestPolicy: OriginRequestPolicy.CORS_S3_ORIGIN,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
    },
    defaultRootObject: 'index.html',
    domainNames: [siteName],
    httpVersion: HttpVersion.HTTP2_AND_3
  })
}
