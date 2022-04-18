import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import { AuthComponent } from '../auth/auth.component';
import { ProtectedAppComponent } from './protected-app.component';

describe('ProtectedAppComponent', () => {
  let fixture: ComponentFixture<ProtectedAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProtectedAppComponent],
      imports: [RouterModule.forRoot([]), MatToolbarModule, MatDividerModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtectedAppComponent);
    fixture.detectChanges();
  });

  it('should have <router-outlet> for contain children routes', () => {
    const fixture = TestBed.createComponent(AuthComponent);
    fixture.detectChanges();
    const authElement: HTMLElement = fixture.nativeElement;
    const element = authElement.querySelector('router-outlet')!;
    expect(element).toBeDefined();
  });
});
