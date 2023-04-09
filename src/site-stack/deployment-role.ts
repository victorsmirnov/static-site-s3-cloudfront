import { ManagedPolicy, OpenIdConnectPrincipal, OpenIdConnectProvider, Role } from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

export interface DeploymentRoleProps {
  readonly githubRepo: string
  readonly provider: OpenIdConnectProvider
}

export function createDeploymentRole (scope: Construct, props: DeploymentRoleProps): Role {
  const { githubRepo, provider } = props

  const role = new Role(scope, 'SiteDeploymentRole', {
    assumedBy: new OpenIdConnectPrincipal(provider)
      .withConditions({
        StringLike: { 'token.actions.githubusercontent.com:sub': `repo:${githubRepo}:*` }
      }),
    roleName: 'SiteDeploymentRole'
  })
  role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'))

  return role
}
