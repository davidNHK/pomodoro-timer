import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { LogoutComponent } from './logout.component';

describe('AuthLogoutComponent', () => {
  async function setupTest({ navigate }: { navigate: jasmine.Spy }) {
    await TestBed.configureTestingModule({
      declarations: [LogoutComponent],
      imports: [MatButtonModule, HttpClientModule],
      providers: [
        {
          provide: Router,
          useValue: { navigate },
        },
        AuthService,
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(LogoutComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
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
