import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.user?.token || '';
  const newReq = req.clone({ 
    withCredentials: true,
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
   });
  return next(newReq);
};
