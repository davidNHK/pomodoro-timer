import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/app/auth/auth.service';
import { mergeMap } from 'rxjs/operators';

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
        mergeMap(({ code }) => this.authService.exchangeTokenFromCode(code)),
      )
      .subscribe(resp => {
        if (resp?.error) return this.router.navigate(['/auth/login']);
        return this.router.navigate(['/app']);
      });
  }
}
