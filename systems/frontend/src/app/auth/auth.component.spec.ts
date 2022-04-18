import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [RouterModule.forRoot([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    fixture.detectChanges();
  });

  it('should have <router-outlet> for contain children routes', () => {
    const authElement: HTMLElement = fixture.nativeElement;
    const element = authElement.querySelector('router-outlet')!;
    expect(element).toBeDefined();
  });
});
