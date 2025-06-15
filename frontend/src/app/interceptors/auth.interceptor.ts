import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwt-token');

  if (token) {
    const clonado = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });

    return next(clonado);
  } else {
    return next(req);
  }
};
