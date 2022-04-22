import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, mergeMap } from 'rxjs/operators';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-callback',
  styleUrls: ['./callback.component.css'],
  templateUrl: './callback.component.html',
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.route.queryParams
      .pipe(
        filter(({ code }) => !!code),
        mergeMap(({ code }) => {
          return this.authService.exchangeTokenFromCode(code);
        }),
      )
      .subscribe(resp => {
        if (resp?.errors) return this.router.navigate(['/auth/login']);
        return this.router.navigate(['/app']);
      });
  }
}
