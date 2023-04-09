import { App } from 'aws-cdk-lib'
import Joi from 'joi'
import { env } from 'process'
import { createSiteStack } from './site-stack/site-stack.js'
import { createCertificateStack } from './certificate-stack/certificate-stack.js'
import { createGithubConnectionStack } from './github-connection-stack/github-connection-stack.js'

validateEnvironment()

/**
 * Application parameters
 * 1. In local environment, we take the values from the `.env` file. Remember to create one.
 * 2. In GitHub action, we take the values from the secrets. Remember to create `DOMAIN_NAME` and `SITE_NAME `secrets.
 */
const domainName = env.DOMAIN_NAME
const siteName = env.SITE_NAME
const githubRepo = env.GITHUB_REPOSITORY

const app = new App()

/**
 * Stack for the GitHub OpenID connection. We need only one connection for the account.
 */
const { provider } = createGithubConnectionStack(app, { stackName: 'github-connection' })

const { certificate, certificateStack } = createCertificateStack(app, {
  domainName,
  siteName,
  stackName: 'certificate-' + siteName.split('.').join('-')
})
certificateStack.tags.setTag('project', 'static-site')
certificateStack.tags.setTag('site', siteName)

const siteStack = createSiteStack(app, {
  bucketName: siteName,
  certificate,
  domainName,
  githubRepo,
  provider,
  siteName,
  stackName: 'site-' + siteName.split('.').join('-')
})
siteStack.tags.setTag('project', 'static-site')
siteStack.tags.setTag('site', siteName)

/**
 * Validate environment variables.
 */
function validateEnvironment (): void {
  const envSchema = Joi.object({
    CDK_DEFAULT_ACCOUNT: Joi.string().required(),
    CDK_DEFAULT_REGION: Joi.string().required(),
    DOMAIN_NAME: Joi.string().required(),
    GITHUB_REPOSITORY: Joi.string().required(),
    SITE_NAME: Joi.string().required()
  }).unknown(true)

  const validationRes = envSchema.validate(env)
  if (validationRes.error != null) {
    throw new Error('Missing environment variables: ' +
      validationRes.error.details.map((d) => d.message).join(', '))
  }
}
