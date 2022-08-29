import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager'
import {
  AllowedMethods,
  CachePolicy,
  Distribution,
  OriginAccessIdentity,
  OriginRequestPolicy,
  ViewerProtocolPolicy
} from 'aws-cdk-lib/aws-cloudfront'
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { Bucket } from 'aws-cdk-lib/aws-s3'
import { Construct } from 'constructs'

export interface CloudFrontProps {
  readonly accessIdentity: OriginAccessIdentity
  readonly certificate: DnsValidatedCertificate
  readonly siteBucket: Bucket
  readonly siteName: string
}

export function createCloudFront (scope: Construct, props: CloudFrontProps): Distribution {
  const bucketOrigin = new S3Origin(props.siteBucket, {
    originAccessIdentity: props.accessIdentity,
    originPath: '/public'
  })

  return new Distribution(scope, 'Distribution', {
    certificate: props.certificate,
    comment: `${props.siteName} static site bucket`,
    defaultBehavior: {
      allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
      cachePolicy: CachePolicy.CACHING_OPTIMIZED,
      origin: bucketOrigin,
      originRequestPolicy: OriginRequestPolicy.CORS_S3_ORIGIN,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
    },
    defaultRootObject: 'index.html',
    domainNames: [props.siteName]
  })
}
