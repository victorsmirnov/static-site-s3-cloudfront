import { Stack } from 'aws-cdk-lib'
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager'
import { HostedZone } from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'

export interface CertificateStackProps {
  readonly domainName: string
  readonly siteName: string
  readonly stackName: string
}

export interface CertificateStack {
  certificate: Certificate
  certificateStack: Stack
}

export function createCertificateStack (scope: Construct, props: CertificateStackProps): CertificateStack {
  const { domainName, siteName, stackName } = props
  const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' }

  const certificateStack = new Stack(scope, 'CertificateStack', { crossRegionReferences: true, env, stackName })

  const zone = HostedZone.fromLookup(certificateStack, 'Zone', { domainName })

  const certificate = new Certificate(certificateStack, 'Certificate', {
    domainName: siteName,
    validation: CertificateValidation.fromDns(zone)
  })

  return { certificate, certificateStack }
}
