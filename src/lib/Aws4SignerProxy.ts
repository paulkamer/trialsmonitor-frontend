import { AwsV4Signer } from 'aws4fetch'
import { Auth } from 'aws-amplify';
import { HttpHeaders } from '@angular/common/http';

/**
 * Proxy for AwsV4Signer of the aws4fetch lib
 * Ensures that the correct Authorization header is formatted, but still allows
 * for the use of Angular's http client.
 */
export class Aws4SignerProxy {
  signerInstance: AwsV4Signer;

  async sign(opts) {
    await this.initSigner(opts);

    const request = await this.signerInstance.sign();

    // Convert Headers object used by AwsV4Signer into an Angular HttpHeaders object
    request.headers = new HttpHeaders(Object.fromEntries(request.headers.entries()));

    return request;
  }

  private async initSigner (opts): AwsV4Signer {
    const credentials = await Auth.currentCredentials();
    const { accessKeyId, secretAccessKey, sessionToken } = credentials;

    const options = {
      ...opts,
      accessKeyId,
      secretAccessKey,
      sessionToken,
      region: 'eu-central-1',
      service: 'execute-api',
    }

    this.signerInstance = new AwsV4Signer(options);
  }
}
