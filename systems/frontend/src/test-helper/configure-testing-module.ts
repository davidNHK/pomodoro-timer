import type { Type } from '@angular/core';
import type { TestModuleMetadata } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export function configureTestingModule(moduleDef: TestModuleMetadata) {
  return TestBed.configureTestingModule({
    declarations: moduleDef.declarations,
    imports: [
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      MatToolbarModule,
      MatDividerModule,
      MatTabsModule,
      MatButtonModule,
      MatInputModule,
      MatCardModule,
      MatSnackBarModule,
      MatProgressSpinnerModule,
      MatIconModule,
      MatListModule,
      ...(moduleDef.imports || []),
    ],
    providers: moduleDef.providers,
  });
}

export async function configureTestingModuleForComponent<T>(
  componentCls: Type<T>,
  moduleDef: TestModuleMetadata,
) {
  await configureTestingModule({
    declarations: moduleDef.declarations,
    imports: [
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      MatToolbarModule,
      MatDividerModule,
      MatTabsModule,
      MatButtonModule,
      MatInputModule,
      MatCardModule,
      MatSnackBarModule,
      MatProgressSpinnerModule,
      MatIconModule,
      MatListModule,
      ...(moduleDef.imports || []),
    ],
    providers: moduleDef.providers,
  }).compileComponents();
  const fixture = TestBed.createComponent(componentCls);
  const component = fixture.componentInstance;
  fixture.detectChanges();
  return { component, fixture };
}
