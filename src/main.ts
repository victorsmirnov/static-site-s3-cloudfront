import { App } from 'aws-cdk-lib'
import { env } from 'process'
import Joi from 'joi'
import { createSiteStack } from './site-stack.js'

validateEnvironment()

const app = new App()
createSiteStack(app, {
  env: { account: env.CDK_DEFAULT_ACCOUNT, region: env.CDK_DEFAULT_REGION },
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
