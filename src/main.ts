import { App, Environment } from 'aws-cdk-lib'
import { env } from 'process'
import Joi from 'joi'
import { createGithubConnectionStack } from './github-connection-stack.js'
import { createSiteStack } from './site-stack.js'

validateEnvironment()

const stackEnv: Environment = { account: env.CDK_DEFAULT_ACCOUNT, region: env.CDK_DEFAULT_REGION }

const app = new App()

createGithubConnectionStack(app, { env: stackEnv, stackName: 'github-connection' })

createSiteStack(app, {
  env: stackEnv,
  githubRepo: 'victorsmirnov/static-site-s3-cloudfront',
  stackName: 'static-site-smirnov-se'
})

/**
 * Validate environment variables.
 */
function validateEnvironment (): void {
  const envSchema = Joi.object({
    CDK_DEFAULT_ACCOUNT: Joi.string().required(),
    CDK_DEFAULT_REGION: Joi.string().required()
  }).unknown(true)

  const validationRes = envSchema.validate(env)
  if (validationRes.error != null) {
    throw validationRes.error
  }
}
