import { Environment, Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'

export interface SiteStackProps {
  /**
   * AWS environment where we deploy our stack.
   */
  readonly env: Environment

  /**
   * Custom stack name
   */
  readonly stackName: string
}

export function createSiteStack (scope: Construct, props: SiteStackProps): Stack {
  const stack = new Stack(scope, 'BlogStack', {
    env: props.env,
    stackName: props.stackName
  })

  return stack
}
