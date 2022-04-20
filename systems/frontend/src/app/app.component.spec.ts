import { RouterModule } from '@angular/router';
import { configureTestingModuleForComponent } from '@app-test-helper/configure-testing-module';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('should have <router-outlet> for contain children routes', async () => {
    const { fixture } = await configureTestingModuleForComponent(AppComponent, {
      declarations: [AppComponent],
      imports: [RouterModule.forRoot([])],
    });

    const authElement: HTMLElement = fixture.nativeElement;
    const element = authElement.querySelector('router-outlet')!;
    expect(element).toBeDefined();
  });
});
