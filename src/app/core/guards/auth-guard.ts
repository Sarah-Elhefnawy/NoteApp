import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);
  const _AuthService = inject(AuthService);

  const token = _AuthService.userToken.getValue();
  
  if (token && token !== 'null' && token !== 'undefined') {
    return true;
  } else {
    return _Router.navigate(['/login']);
  }
};