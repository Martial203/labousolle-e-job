import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";
import { Role } from "../../enums/role/role";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.user) {
      console.log(this.authService.user);
      if(this.authService.user.role === Role.ADMIN) return true;
      this.router.navigateByUrl('/home');
      return false;
    } else {
      this.router.navigateByUrl('/auth/login');
      return false;
    }
  }
}