import { TestBed } from '@angular/core/testing';
import { configureTestingModule } from '@app-test-helper/configure-testing-module';
import { firstValueFrom, lastValueFrom, take } from 'rxjs';

import { CountdownService } from './countdown.service';

describe('CountdownService', () => {
  function setupTest() {
    configureTestingModule({
      providers: [CountdownService],
    });
    const service = TestBed.inject(CountdownService);
    return { service };
  }

  it('#start change running to true when called', async () => {
    const { service } = setupTest();
    expect(service.running).toBeFalsy();
    service.start(100);
    expect(service.running).toBeTruthy();
  });

  it('#start will provide number of interval when called', async () => {
    const { service } = setupTest();
    expect(service.running).toBeFalsy();
    const countDown = service.start(1000).pipe(take(2));
    expect(service.running).toBeTruthy();
    const values = [
      await firstValueFrom(countDown),
      await lastValueFrom(countDown),
    ];
    expect(values[0]).toEqual(0);
    expect(values[1]).toEqual(500);
  });

  it(`#start result stream will stop after 3000 ms`, async () => {
    const { service } = setupTest();
    expect(service.running).toBeFalsy();
    const expectedValues = 6;
    const countDown = service.start(3000);
    expect(service.running).toBeTruthy();
    const resolvedValues = await new Promise<number[]>(resolve => {
      const values: number[] = [];
      countDown.subscribe({
        complete: () => resolve(values),
        next: v => values.push(v),
      });
    });
    expect(resolvedValues.length).toEqual(expectedValues);
  });

  it(`#start result stream will stop after 100 ms`, async () => {
    const { service } = setupTest();
    expect(service.running).toBeFalsy();
    const expectedValues = 1;
    const countDown = service.start(100);
    expect(service.running).toBeTruthy();
    const resolvedValues = await new Promise<number[]>(resolve => {
      const values: number[] = [];
      countDown.subscribe({
        complete: () => resolve(values),
        next: v => values.push(v),
      });
    });
    expect(resolvedValues.length).toEqual(expectedValues);
  });

  it(`#start result stream will stop after 3250 ms`, async () => {
    const { service } = setupTest();
    expect(service.running).toBeFalsy();
    const expectedValues = 7;
    const countDown = service.start(3250);
    expect(service.running).toBeTruthy();
    const resolvedValues = await new Promise<number[]>(resolve => {
      const values: number[] = [];
      countDown.subscribe({
        complete: () => resolve(values),
        next: v => values.push(v),
      });
    });
    expect(resolvedValues.length).toEqual(expectedValues);
  });
});
