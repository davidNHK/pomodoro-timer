import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from './auth.service';
import { LogoutComponent } from './logout/logout.component';

@NgModule({
  declarations: [LogoutComponent],
  exports: [LogoutComponent],
  imports: [CommonModule, MatButtonModule, HttpClientModule],
  providers: [AuthService],
})
export class AuthModule {}
