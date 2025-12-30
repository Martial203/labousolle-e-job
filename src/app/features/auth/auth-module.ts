import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing-module';
import { Login } from './pages/login/login';
import { SharedModule } from '../../shared/shared-module';
import { SignUp } from './pages/sign-up/sign-up';
import { ForgottenPassword } from './pages/forgotten-password/forgotten-password';
import { ChooseInterests } from './pages/choose-interests/choose-interests';
import { Auth } from './auth/auth';


@NgModule({
  declarations: [
    Login,
    SignUp,
    ForgottenPassword,
    ChooseInterests,
    Auth
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
