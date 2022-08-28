import { Environment, Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { createDeploymentRole } from './deployment-role.js'

export interface SiteStackProps {
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
   * Custom stack name
   */
  readonly stackName: string
}

export function createSiteStack (scope: Construct, props: SiteStackProps): Stack {
  const stack = new Stack(scope, 'SiteStack', {
    env: props.env,
    stackName: props.stackName
  })

  createDeploymentRole(stack, { account: String(props.env.account), githubRepo: props.githubRepo })

  return stack
}
