import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Auth, { CognitoUser } from '@aws-amplify/auth';
import { NotificationService } from 'src/app/services/notification.service';
import { LoaderService } from 'src/app/loader/loader.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup = new FormGroup({
    email: new FormControl('', [ Validators.email ]),
    fname: new FormControl('', [ Validators.min(2) ]),
    lname: new FormControl('', [ Validators.min(2) ])
  });
  profile: any = {};
  user: CognitoUser;

  get emailInput() { return this.profileForm.get('email'); }
  get fnameInput() { return this.profileForm.get('fname'); }
  get lnameInput() { return this.profileForm.get('lname'); }

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _notification: NotificationService,
    public loading: LoaderService ) { }

  ngOnInit() {
    this.loading.show();
    this.getUserInfo();
  }

  async getUserInfo() {
    this.profile = await Auth.currentUserInfo();
    this.user = await Auth.currentAuthenticatedUser();

    this.fnameInput.setValue(this.profile.attributes.given_name);
    this.lnameInput.setValue(this.profile.attributes.family_name);
    this.loading.hide();
  }

  getEmailInputError() {
    if (this.emailInput.hasError('email')) {
      return 'Please enter a valid email address.';
    }
    if (this.emailInput.hasError('required')) {
      return 'An Email is required.';
    }
  }

  signOut() {
    this._authService.signOut()
      .then(() => this._router.navigate(['auth/signin']));
  }

  async editProfile() {
    try {
      const attributes = {
        given_name: this.fnameInput.value,
        family_name: this.lnameInput.value,
      };

      await Auth.updateUserAttributes(this.user, attributes);
      this._notification.show('Your profile information has been updated.');
    } catch (error) {
      console.error(error);
    }
  }
}
