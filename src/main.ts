import { App } from 'aws-cdk-lib'
import Joi from 'joi'
import { env } from 'process'
import { createSiteStack } from './site-stack.js'

validateEnvironment()

/**
 * Application parameters
 * 1. In local environment, we take the values from the `.env` file. Remember to create one.
 * 2. In GitHub action, we take the values from the secrets. Remember to create `DOMAIN_NAME` and `SITE_NAME `secrets.
 */
const domainName = env.DOMAIN_NAME
const siteName = env.SITE_NAME
const githubRepo = env.GITHUB_REPOSITORY

/**
 * Stack for the GitHub OpenID connection. We need only one connection for the account.
 * I would move it to another repository someday.
 */
// createGithubConnectionStack(app, { env: stackEnv, stackName: 'github-connection' })

const app = new App()
createSiteStack(app, {
  bucketName: siteName,
  domainName,
  env: { account: env.CDK_DEFAULT_ACCOUNT, region: env.CDK_DEFAULT_REGION },
  githubRepo,
  siteName,
  stackName: 'site-' + siteName.split('.').join('-')
})

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
    throw validationRes.error
  }
}
