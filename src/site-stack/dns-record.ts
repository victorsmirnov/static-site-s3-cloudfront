import { Distribution } from 'aws-cdk-lib/aws-cloudfront'
import { ARecord, IPublicHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53'
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets'
import { Construct } from 'constructs'

export interface DnsRecordProps {
  readonly cloudFront: Distribution
  readonly zone: IPublicHostedZone
  readonly siteName: string
}

export function createDnsRecord (scope: Construct, props: DnsRecordProps): ARecord {
  const { cloudFront, zone, siteName } = props

  return new ARecord(scope, 'SiteRecord', {
    recordName: siteName,
    target: RecordTarget.fromAlias(new CloudFrontTarget(cloudFront)),
    zone
  })
}
