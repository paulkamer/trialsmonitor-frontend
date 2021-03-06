import { Injectable } from '@angular/core';
import Auth from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';
import { Subject, Observable } from 'rxjs';
import { CognitoUser } from 'amazon-cognito-identity-js';

export interface NewUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
    Hub.listen('auth', (data) => {
      const { channel, payload } = data;
      if (channel === 'auth') {
        this._authState.next(payload.event);
      }
    });
  }

  public static SIGN_IN = 'signIn';
  public static SIGN_OUT = 'signOut';

  public loggedIn: boolean;
  private _authState: Subject<CognitoUser|any> = new Subject<CognitoUser|any>();
  authState: Observable<CognitoUser|any> = this._authState.asObservable();

  signUp(user: NewUser): Promise<CognitoUser|any> {
    return Auth.signUp({
      username: user.email,
      password: user.password,
      attributes: {
        email: user.email,
        given_name: user.firstName,
        family_name: user.lastName
      }
    });
  }

  signIn(username: string, password: string): Promise<CognitoUser|any> {
    return new Promise((resolve, reject) => {
      Auth.signIn(username, password)
      .then((user: CognitoUser|any) => {
        this.loggedIn = true;
        resolve(user);
      }).catch((error: any) => reject(error));
    });
  }

  signOut(): Promise<any> {
    return Auth.signOut()
      .then(() => this.loggedIn = false);
  }

  // socialSignIn(provider:CognitoHostedUIIdentityProvider): Promise<ICredentials> {
  //   return Auth.federatedSignIn({
  //     'provider': provider
  //   });
  // }
}
