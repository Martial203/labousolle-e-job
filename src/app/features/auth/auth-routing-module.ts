import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';
import { ChooseInterests } from './pages/choose-interests/choose-interests';
import { ForgottenPassword } from './pages/forgotten-password/forgotten-password';
import { NewPassword } from './pages/new-password/new-password';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'sign-up', component: SignUp },
  { path: 'choose-interests', component: ChooseInterests },
  { path: 'forgotten-password', component: ForgottenPassword },
  { path: 'new-password/:resetToken', component: NewPassword }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
