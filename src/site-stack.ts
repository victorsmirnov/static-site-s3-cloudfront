import { Environment, Stack } from 'aws-cdk-lib'
import { OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront'
import { HostedZone } from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'
import { createCertificate } from './certificate.js'
import { createCloudFront } from './cloud-front.js'
import { createDeploymentRole } from './deployment-role.js'
import { createDnsRecord } from './dns-record.js'
import { createSiteBucket } from './site-bucket.js'

export interface SiteStackProps {
  /**
   * Site bucket name.
   */
  readonly bucketName: string

  /**
   * Domain name hosted on Route 53. We create siteName in this domain.
   */
  readonly domainName: string

  /**
   * AWS environment where we deploy our stack.
   */
  readonly env: Environment

  /**
   * GitHub repository name to restrict access to the deployment role.
   * Actions from the repository will be able to assume the deployment role.
   * Name format: <owner>/<repository>.
   */
  readonly githubRepo: string

  /**
   * Site domain name under the domainName.
   */
  readonly siteName: string

  /**
   * Custom stack name
   */
  readonly stackName: string
}

export function createSiteStack (scope: Construct, props: SiteStackProps): Stack {
  const { bucketName, domainName, env, githubRepo, siteName, stackName } = props

  const stack = new Stack(scope, 'SiteStack', { env, stackName })

  const hostedZone = HostedZone.fromLookup(stack, 'HostedZone', { domainName })

  const certificate = createCertificate(stack, { siteName, hostedZone })

  const siteBucket = createSiteBucket(stack, { bucketName })

  const accessIdentity = new OriginAccessIdentity(stack, 'CloudfrontAccess')

  const cloudFront = createCloudFront(stack, { accessIdentity, certificate, siteName, siteBucket })

  createDnsRecord(stack, { cloudFront, hostedZone, siteName })

  createDeploymentRole(stack, { account: String(props.env.account), githubRepo })

  return stack
}
