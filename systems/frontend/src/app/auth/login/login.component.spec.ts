import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { LoginComponent } from './login.component';

describe('AuthLoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [MatListModule, MatIconModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  });

  it('should have login with atlassian', () => {
    const authElement: HTMLElement = fixture.nativeElement;
    const element = authElement.querySelector(
      'a[data-testid="login-with-atlassian"]',
    )!;
    expect(element).toBeDefined();
  });

  it('should have login with google and it should disabled', () => {
    const authElement: HTMLElement = fixture.nativeElement;
    const element = authElement.querySelector(
      'a[data-testid="login-with-google"]',
    )!;
    expect(element).toBeDefined();
    expect(element.getAttribute('disabled')).toBeDefined();
  });
});
