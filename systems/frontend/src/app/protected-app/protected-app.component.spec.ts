import { RouterModule } from '@angular/router';
import { configureTestingModuleForComponent } from '@app-test-helper/configure-testing-module';

import { ProtectedAppComponent } from './protected-app.component';

describe('ProtectedAppComponent', () => {
  it('should have <router-outlet> for contain children routes', async () => {
    const { fixture } = await configureTestingModuleForComponent(
      ProtectedAppComponent,
      {
        declarations: [ProtectedAppComponent],
        imports: [RouterModule.forRoot([])],
      },
    );
    const authElement: HTMLElement = fixture.nativeElement;
    const element = authElement.querySelector('router-outlet')!;
    expect(element).toBeDefined();
  });
});
