import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-my-nav',
  templateUrl: './my-nav.component.html',
  styleUrl: './my-nav.component.scss',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterLink,
    RouterOutlet,
    FooterComponent
  ]
})
export class MyNavComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private _AuthService = inject(AuthService);

  isLoggedIn!: boolean;

  private checkAuthState() {
    const token = this._AuthService.userToken.getValue();
    this.isLoggedIn = !!(token && token !== 'null' && token !== 'undefined' && token.trim() !== '');
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  logOutBtn() {
    this._AuthService.logOut()
  }

  ngOnInit(): void {
    this.checkAuthState();
    this._AuthService.userToken.subscribe(() => {
      this.checkAuthState();
    });
  }
}
