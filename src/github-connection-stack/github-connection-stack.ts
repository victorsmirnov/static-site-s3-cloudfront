import { Stack } from 'aws-cdk-lib'
import { OpenIdConnectProvider } from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

export interface GithubConnectionStackProps {
  readonly stackName: string
}

export interface GithubConnectionStack {
  githubConnectionStack: Stack
  provider: OpenIdConnectProvider
}

export function createGithubConnectionStack (scope: Construct, props: GithubConnectionStackProps): GithubConnectionStack {
  const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
  const githubConnectionStack = new Stack(scope, 'GithubConnectionStack', { env, stackName: props.stackName })

  // Configure GitHub OpenID connection following
  // https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services
  // CloudFormation template example:
  // https://github.com/aws-actions/configure-aws-credentials#sample-iam-role-cloudformation-template
  const provider = new OpenIdConnectProvider(githubConnectionStack, 'GitHubProvider', {
    clientIds: ['sts.amazonaws.com'],
    thumbprints: ['6938fd4d98bab03faadb97b34396831e3780aea1'],
    url: 'https://token.actions.githubusercontent.com'
  })

  return { githubConnectionStack, provider }
}
