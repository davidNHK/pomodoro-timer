import { ActivatedRoute, Router } from '@angular/router';
import { configureTestingModuleForComponent } from '@app-test-helper/configure-testing-module';
import { Observable, of } from 'rxjs';

import { AuthService } from '../auth.service';
import { CallbackComponent } from './callback.component';

describe('AuthCallbackComponent', () => {
  async function setupTest({
    apiResponse,
    navigate,
    queryParams,
  }: {
    apiResponse: Observable<unknown>;
    navigate: jasmine.Spy;
    queryParams: Observable<{ code?: string }>;
  }) {
    await configureTestingModuleForComponent(CallbackComponent, {
      declarations: [CallbackComponent],
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
    });
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
