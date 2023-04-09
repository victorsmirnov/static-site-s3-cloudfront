import { Duration, RemovalPolicy } from 'aws-cdk-lib'
import { BlockPublicAccess, Bucket, BucketAccessControl, BucketEncryption } from 'aws-cdk-lib/aws-s3'
import { Construct } from 'constructs'

export interface WebsiteBucketProps {
  readonly bucketName: string
}

export function createSiteBucket (scope: Construct, props: WebsiteBucketProps): Bucket {
  return new Bucket(scope, 'SiteBucket', {
    accessControl: BucketAccessControl.PRIVATE,
    autoDeleteObjects: true,
    blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    bucketName: props.bucketName,
    encryption: BucketEncryption.S3_MANAGED,
    enforceSSL: true,
    lifecycleRules: [{
      abortIncompleteMultipartUploadAfter: Duration.days(1),
      enabled: true,
      expiredObjectDeleteMarker: true,
      id: 'default',
      noncurrentVersionExpiration: Duration.days(28)
    }],
    removalPolicy: RemovalPolicy.DESTROY,
    versioned: true
  })
}
