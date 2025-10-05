import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const setTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const _PLATFORM_ID = inject(PLATFORM_ID);


  if (isPlatformBrowser(_PLATFORM_ID)) {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        req = req.clone({
          setHeaders: {
            token: token
          }
        });
      }
    } catch (error) {
      console.warn('Could not access localStorage:', error);
    }
  }

  return next(req);
};
