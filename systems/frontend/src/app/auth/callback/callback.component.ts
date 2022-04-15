import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-auth-callback',
  styleUrls: ['./callback.component.css'],
  templateUrl: './callback.component.html',
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.route.queryParams
      .pipe(
        mergeMap(({ code }) =>
          this.http.post(
            'http://localhost:5333/auth/token',
            new URLSearchParams({
              code,
              grant_type: 'authorization_code',
            }).toString(),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            },
          ),
        ),
      )
      .subscribe({
        error: (err: HttpErrorResponse) => {
          if (err.error.code === 'ERR_EXCHANGE_CODE') {
            this.router.navigate(['/auth/login']);
          }
        },
        next: (resp: any) => {
          window.localStorage.setItem('accessToken', resp.accessToken);
          window.localStorage.setItem('refreshToken', resp.refreshToken);
          this.router.navigate(['/app']);
        },
      });
  }
}
