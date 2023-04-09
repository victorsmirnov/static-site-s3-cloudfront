import { Stack } from 'aws-cdk-lib'
import { HostedZone } from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'
import { createCloudFront } from './cloud-front.js'
import { createDeploymentRole } from './deployment-role.js'
import { createDnsRecord } from './dns-record.js'
import { createSiteBucket } from './site-bucket.js'
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager'
import { OpenIdConnectProvider } from 'aws-cdk-lib/aws-iam'

export interface SiteStackProps {
  /**
   * Site bucket name.
   */
  readonly bucketName: string

  /**
   * Certificate for the CloudFront distribution. Must be in the us-east-1 region.
   */
  readonly certificate: Certificate

  /**
   * Domain name hosted on Route 53. We create siteName in this domain.
   */
  readonly domainName: string

  /**
   * GitHub repository name to restrict access to the deployment role.
   * Actions from the repository will be able to assume the deployment role.
   * Name format: <owner>/<repository>.
   */
  readonly githubRepo: string

  /**
   * OpenID Connect provider for the deployment role.
   */
  readonly provider: OpenIdConnectProvider

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
  const { bucketName, certificate, domainName, githubRepo, provider, siteName, stackName } = props

  const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }

  const stack = new Stack(scope, 'SiteStack', { crossRegionReferences: true, env, stackName })

  const zone = HostedZone.fromLookup(stack, 'HostedZone', { domainName })

  const siteBucket = createSiteBucket(stack, { bucketName })

  const cloudFront = createCloudFront(stack, { certificate, siteName, siteBucket })

  createDnsRecord(stack, { cloudFront, siteName, zone })

  createDeploymentRole(stack, { githubRepo, provider })

  return stack
}
