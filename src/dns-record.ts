import { Distribution } from 'aws-cdk-lib/aws-cloudfront'
import { ARecord, IPublicHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53'
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets'
import { Construct } from 'constructs'

export interface DnsRecordProps {
  readonly cloudFront: Distribution
  readonly hostedZone: IPublicHostedZone
  readonly siteName: string
}

export function createDnsRecord (scope: Construct, props: DnsRecordProps): ARecord {
  return new ARecord(scope, 'SiteRecord', {
    recordName: props.siteName,
    target: RecordTarget.fromAlias(new CloudFrontTarget(props.cloudFront)),
    zone: props.hostedZone
  })
}
