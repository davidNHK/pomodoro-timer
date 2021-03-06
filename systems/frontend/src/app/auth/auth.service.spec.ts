import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { configureTestingModule } from '@app-test-helper/configure-testing-module';
import { lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

const testUrl = `${environment.apiUrl}/auth/token`;

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('#exchangeTokenFromCode', () => {
    function setupTest(code: string) {
      const req = httpTestingController.expectOne(testUrl);
      expect(req.request.method).toEqual('POST');
      expect(req.request.headers.get('Content-Type')).toEqual(
        'application/x-www-form-urlencoded',
      );
      expect(req.request.body).toEqual(
        new URLSearchParams({
          code: code,
          grant_type: 'authorization_code',
        }).toString(),
      );
      return req;
    }
    it('should call endpoint and save token to storage when success response', async () => {
      const exchangeTokenFromCodeResp = lastValueFrom(
        service.exchangeTokenFromCode('123'),
      );
      const req = setupTest('123');

      req.flush({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
      const { error } = await exchangeTokenFromCodeResp;
      expect(error).toBeUndefined();
      expect(service.accessToken).toEqual('accessToken');
      expect(service.refreshToken).toEqual('refreshToken');
    });

    it('should call endpoint and return error when error code is ERR_EXCHANGE_CODE', async () => {
      const exchangeTokenFromCodeResp = lastValueFrom(
        service.exchangeTokenFromCode('123'),
      );
      const req = setupTest('123');

      req.flush(
        {
          errors: [{ code: 'ERR_EXCHANGE_CODE' }],
        },
        { status: 401, statusText: 'Unauthorized' },
      );
      const { errors } = await exchangeTokenFromCodeResp;

      expect(errors[0].code).toEqual('ERR_EXCHANGE_CODE');
      expect(service.accessToken).toBeNull();
      expect(service.refreshToken).toBeNull();
    });

    it('should call endpoint and throw error when status code is 500', async () => {
      const exchangeTokenFromCodeResp = lastValueFrom(
        service.exchangeTokenFromCode('123'),
      );
      const req = setupTest('123');
      req.flush(
        {
          errors: [{ code: 'ERR_UNHANDLED' }],
        },
        { status: 500, statusText: 'Internal Server Error' },
      );
      await expectAsync(exchangeTokenFromCodeResp).toBeRejected();
    });
  });

  describe('#refreshAccessToken', () => {
    function setupTest(refreshToken: string) {
      const req = httpTestingController.expectOne(testUrl);
      expect(req.request.method).toEqual('POST');
      expect(req.request.headers.get('Content-Type')).toEqual(
        'application/x-www-form-urlencoded',
      );
      expect(req.request.body).toEqual(
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }).toString(),
      );
      return req;
    }
    it('should call endpoint and save token to storage when success response', async () => {
      const refreshAccessTokenResp = lastValueFrom(
        service.refreshAccessToken('123'),
      );

      const req = setupTest('123');

      req.flush({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
      const { error } = await refreshAccessTokenResp;
      expect(error).toBeUndefined();
      expect(service.accessToken).toEqual('accessToken');
      expect(service.refreshToken).toEqual('refreshToken');
    });

    it('should call endpoint and return error when error code is ERR_REFRESH_TOKEN', async () => {
      const refreshAccessTokenResp = lastValueFrom(
        service.refreshAccessToken('123'),
      );

      const req = setupTest('123');

      req.flush(
        {
          errors: [{ code: 'ERR_REFRESH_TOKEN' }],
        },
        { status: 401, statusText: 'Unauthorized' },
      );
      const { errors } = await refreshAccessTokenResp;
      expect(errors[0].code).toEqual('ERR_REFRESH_TOKEN');
      expect(service.accessToken).toBeNull();
      expect(service.refreshToken).toBeNull();
    });

    it('should call endpoint and throw error when status code is 500', async () => {
      const refreshAccessTokenResp = lastValueFrom(
        service.refreshAccessToken('123'),
      );
      const req = setupTest('123');
      req.flush(
        {
          errors: [{ code: 'ERR_UNHANDLED' }],
        },
        { status: 500, statusText: 'Internal Server Error' },
      );
      await expectAsync(refreshAccessTokenResp).toBeRejected();
    });
  });
});
