import {
  Component,
  ChangeDetectorRef,
  EventEmitter,
  Output,
  OnInit
} from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";
import { MatSidenav } from "@angular/material/sidenav";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "./auth/auth.service";
import Auth from "@aws-amplify/auth";
import Storage from "@aws-amplify/storage";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})

export class AppComponent implements OnInit {
  title = 'Clinicaltrials.gov monitor';
  mobileQuery: MediaQueryList;
  nav = [
    {
      'title': 'Home',
      'path': '/'
    },
    {
      'title': 'Trials',
      'path': '/trials'
    },
    {
      'title': 'Trial searches',
      'path': '/trial_searches'
    },
    {
      'title': 'My Account',
      'path': '/auth'
    }
  ];

  private _mobileQueryListener: () => void;
  @Output() toggleSideNav = new EventEmitter();

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public auth: AuthService,
    private toast: MatSnackBar
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    auth.authState.subscribe((event: string) => {
      if (event === AuthService.SIGN_IN) this.checkSession();
    });
  }

  ngOnInit() {
    this.checkSession();
  }

  async checkSession() {
    try {
      const userInfo = await Auth.currentUserInfo();
    } catch (error) {
      console.error("no session: ", error);
    }
  }
  toggleMobileNav(nav: MatSidenav) {
    if (this.mobileQuery.matches) {
      nav.toggle();
    }
  }
}