import { RouterModule } from '@angular/router';
import { configureTestingModuleForComponent } from '@app-test-helper/configure-testing-module';

import { AuthModule } from '../auth/auth.module';
import { ProtectedComponent } from './protected.component';

describe('ProtectedAppComponent', () => {
  it('should have <router-outlet> for contain children routes', async () => {
    const { fixture } = await configureTestingModuleForComponent(
      ProtectedComponent,
      {
        declarations: [ProtectedComponent],
        imports: [RouterModule.forRoot([]), AuthModule],
      },
    );
    const authElement: HTMLElement = fixture.nativeElement;
    const element = authElement.querySelector('router-outlet')!;
    expect(element).toBeDefined();
  });
});
