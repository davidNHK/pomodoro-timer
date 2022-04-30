import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import type { AxiosRequestConfig } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import type { AxiosError, AxiosResponse } from 'axios';
import { mergeLeft } from 'ramda';
import {
  from,
  lastValueFrom,
  mergeMap,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AtlassianTokenService } from '../../auth/atlassian.strategy';
import { UserProvider } from '../../user/connected-provider/connected-provider.model';
import { ConnectedProviderService } from '../../user/connected-provider/connected-provider.service';

function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError;
}

@Injectable()
export class JiraService {
  logger = new Logger(JiraService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly connectedProviderService: ConnectedProviderService,
    private readonly atlassianTokenService: AtlassianTokenService,
  ) {}

  private httpRequest$(
    userId: string,
    config: AxiosRequestConfig,
  ): Observable<AxiosResponse> {
    return this.connectedProviderService
      .getUserConnectedCredential$(userId, UserProvider.ATLASSIAN)
      .pipe(
        mergeMap(credential =>
          this.httpService
            .request(
              mergeLeft(
                {
                  headers: {
                    Authorization: `Bearer ${credential.accessToken}`,
                  },
                },
                config,
              ),
            )
            .pipe(
              catchError(error => {
                if (!isAxiosError(error)) {
                  return throwError(error);
                }
                const isUnauthorized = error.response?.status === 401;
                if (!isUnauthorized) {
                  return throwError(error);
                }

                return this.atlassianTokenService
                  .refreshAccessTokenForUser(userId)
                  .pipe(mergeMap(() => this.httpRequest$(userId, config)));
              }),
            ),
        ),
      );
  }

  getCloudIds$(userId: string) {
    // https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/

    return this.httpRequest$(userId, {
      method: 'GET',
      url: 'https://api.atlassian.com/oauth/token/accessible-resources',
    });
  }

  async getAssignedTask(userId: string) {
    const tasks = await lastValueFrom(
      this.getCloudIds$(userId).pipe(
        mergeMap(({ data }) => from(data as { id: string }[])),
        mergeMap(cloudId => {
          return this.httpRequest$(userId, {
            params: {
              currentJQL: 'assignee=currentUser()',
            },
            url: `https://api.atlassian.com/ex/jira/${cloudId.id}/rest/api/2/issue/picker`,
          });
        }),
        mergeMap(({ data }) => of(data.sections[0].issues)),
      ),
    );
    return tasks;
  }
}
