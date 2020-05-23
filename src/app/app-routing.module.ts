import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
// import { SignUpComponent } from './auth/sign-up/sign-up.component';
// import { ConfirmCodeComponent } from './auth/confirm-code/confirm-code.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { AuthGuard } from './auth/auth.guard';
import { UnauthGuard } from './auth/unauth.guard';

import { TrialsListComponent } from './trials-list/trials-list.component';
import { TrialSearchesListComponent } from './trial-searches-list/trial-searches-list.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent, children: [
    {
      path: 'signin',
      component: SignInComponent,
      canActivate: [UnauthGuard]
    },
    {
      path: 'profile',
      component: ProfileComponent,
      canActivate: [AuthGuard]
    }
  ]},

  { path: 'trials', component: TrialsListComponent, canActivate: [AuthGuard] },
  { path: 'trial_searches', component: TrialSearchesListComponent, canActivate: [AuthGuard] },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
