import { configureTestingModuleForComponent } from '@app-test-helper/configure-testing-module';

import { LoginComponent } from './login.component';

describe('AuthLoginComponent', () => {
  it('should have login with atlassian', async () => {
    const { fixture } = await configureTestingModuleForComponent(
      LoginComponent,
      {
        declarations: [LoginComponent],
      },
    );
    const authElement: HTMLElement = fixture.nativeElement;
    const element = authElement.querySelector(
      'a[data-testid="login-with-atlassian"]',
    )!;
    expect(element).toBeDefined();
  });

  it('should have login with google and it should disabled', async () => {
    const { fixture } = await configureTestingModuleForComponent(
      LoginComponent,
      {
        declarations: [LoginComponent],
      },
    );
    const authElement: HTMLElement = fixture.nativeElement;
    const element = authElement.querySelector(
      'a[data-testid="login-with-google"]',
    )!;
    expect(element).toBeDefined();
    expect(element.getAttribute('disabled')).toBeDefined();
  });
});
