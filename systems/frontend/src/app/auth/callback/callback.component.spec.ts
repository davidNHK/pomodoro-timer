import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { AuthService } from '../auth.service';
import { CallbackComponent } from './callback.component';

describe('AuthCallbackComponent', () => {
  let fixture: ComponentFixture<CallbackComponent>;

  async function setupTest({
    apiResponse,
    navigate,
    queryParams,
  }: {
    apiResponse: Observable<unknown>;
    navigate: jasmine.Spy;
    queryParams: Observable<{ code?: string }>;
  }) {
    await TestBed.configureTestingModule({
      declarations: [CallbackComponent],
      imports: [MatProgressSpinnerModule],
      providers: [
        {
          provide: Router,
          useValue: { navigate },
        },
        {
          provide: AuthService,
          useValue: {
            exchangeTokenFromCode: () => {
              return apiResponse;
            },
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: queryParams,
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CallbackComponent);
    fixture.detectChanges();
  }

  it('should redirect to /app when given code can exchange token', async () => {
    const routerNavigate = jasmine.createSpy();

    await setupTest({
      apiResponse: of({}),
      navigate: routerNavigate,
      queryParams: of({ code: '123' }),
    });
    expect(routerNavigate).toHaveBeenCalledWith(['/app']);
  });

  it('should redirect to /auth/login when given code can exchange token', async () => {
    const routerNavigate = jasmine.createSpy();

    await setupTest({
      apiResponse: of({ error: { code: '/auth/login' } }),
      navigate: routerNavigate,
      queryParams: of({ code: '123' }),
    });
    expect(routerNavigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
