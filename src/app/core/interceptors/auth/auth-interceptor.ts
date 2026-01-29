import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  if(authService.user){
    const newReq = req.clone({ 
      withCredentials: true,
      setHeaders: {
        Authorization: `Token ${authService.user.token}`
      }
    });
    return next(newReq);
  }
  return next(req);
};
