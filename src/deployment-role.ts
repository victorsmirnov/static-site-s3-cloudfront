import { ManagedPolicy, OpenIdConnectPrincipal, OpenIdConnectProvider, Role } from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

export interface DeploymentRoleProps {
  readonly account: string
  readonly githubRepo: string
}

export function createDeploymentRole (scope: Construct, { account, githubRepo }: DeploymentRoleProps): Role {
  const provider = OpenIdConnectProvider.fromOpenIdConnectProviderArn(scope, 'GitHubProvider',
    `arn:aws:iam::${account}:oidc-provider/token.actions.githubusercontent.com`)

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
