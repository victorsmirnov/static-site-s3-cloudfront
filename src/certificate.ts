import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager'
import { IPublicHostedZone } from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'

export interface CertificateProps {
  readonly siteName: string
  readonly hostedZone: IPublicHostedZone
}

export function createCertificate (scope: Construct, props: CertificateProps): DnsValidatedCertificate {
  return new DnsValidatedCertificate(scope, 'CloudFrontCert', {
    domainName: props.siteName,
    hostedZone: props.hostedZone,
    region: 'us-east-1'
  })
}
