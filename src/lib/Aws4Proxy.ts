import { AwsClient as Aws4 } from 'aws4fetch'
import { Auth } from 'aws-amplify';

export class Aws4Proxy {
  async aws4Client() {
    const credentials = await Auth.currentCredentials();
    const { accessKeyId, secretAccessKey, sessionToken } = credentials;

    return new Aws4({
      accessKeyId,
      secretAccessKey,
      sessionToken
    });
  }

  async authOptions() {
    const user = await Auth.currentAuthenticatedUser();
    const jwtToken = user.signInUserSession.idToken.jwtToken;

    const options = {
      headers: {
        Authorization: jwtToken
      }
    };

    return options;
  }
}
