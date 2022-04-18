import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { AuthComponent } from '@app/app/auth/auth.component';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule,
        MatListModule,
        MatIconModule,
        MatProgressSpinnerModule,
      ],
    }).compileComponents();
  });

  it('should have <router-outlet> for contain children routes', () => {
    const fixture = TestBed.createComponent(AuthComponent);
    fixture.detectChanges();
    const authElement: HTMLElement = fixture.nativeElement;
    const element = authElement.querySelector('router-outlet')!;
    expect(element).toBeDefined();
  });
});
