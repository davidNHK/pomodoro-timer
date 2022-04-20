import { RouterModule } from '@angular/router';
import { configureTestingModuleForComponent } from '@app-test-helper/configure-testing-module';

import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  it('should have <router-outlet> for contain children routes', async () => {
    const { fixture } = await configureTestingModuleForComponent(
      AuthComponent,
      {
        declarations: [AuthComponent],
        imports: [RouterModule.forRoot([])],
      },
    );
    const authElement: HTMLElement = fixture.nativeElement;
    const element = authElement.querySelector('router-outlet')!;
    expect(element).toBeDefined();
  });
});
