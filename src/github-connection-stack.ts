import { Construct } from 'constructs'
import { CfnOutput, Environment, Stack } from 'aws-cdk-lib'
import { OpenIdConnectProvider } from 'aws-cdk-lib/aws-iam'

export interface GithubConnectionStackProps {
  /**
   * AWS environment where we deploy our stack.
   */
  readonly env: Environment

  /**
   * Custom stack name
   */
  readonly stackName: string
}

export function createGithubConnectionStack (scope: Construct, props: GithubConnectionStackProps): Stack {
  const stack = new Stack(scope, 'GithubConnectionStack', {
    env: props.env,
    stackName: props.stackName
  })

  // Configure GitHub OpenID connection following
  // https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services
  // CloudFormation template example:
  // https://github.com/aws-actions/configure-aws-credentials#sample-iam-role-cloudformation-template
  const provider = new OpenIdConnectProvider(stack, 'GitHubProvider', {
    clientIds: ['sts.amazonaws.com'],
    thumbprints: ['6938fd4d98bab03faadb97b34396831e3780aea1'],
    url: 'https://token.actions.githubusercontent.com'
  })

  // eslint-disable-next-line no-new
  new CfnOutput(stack, 'GitHubProviderArn', {
    value: provider.openIdConnectProviderArn,
    description: 'ARN for the OpenId connection provider for GitHub'
  })

  return stack
}
