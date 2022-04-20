import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { configureTestingModuleForComponent } from '@app-test-helper/configure-testing-module';

import { AuthService } from '../auth.service';
import { LogoutComponent } from './logout.component';

describe('AuthLogoutComponent', () => {
  async function setupTest({ navigate }: { navigate: jasmine.Spy }) {
    const { component, fixture } = await configureTestingModuleForComponent(
      LogoutComponent,
      {
        declarations: [LogoutComponent],
        imports: [MatButtonModule, HttpClientModule],
        providers: [
          {
            provide: Router,
            useValue: { navigate },
          },
          AuthService,
        ],
      },
    );
    return { component, fixture };
  }

  it('should redirect to /auth/login when given code can exchange token', async () => {
    const routerNavigate = jasmine.createSpy();

    const { component } = await setupTest({
      navigate: routerNavigate,
    });
    component.logout();
    expect(routerNavigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
