import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { UserProvider } from '../../user/connected-provider/connected-provider.model';
import { ConnectedProviderService } from '../../user/connected-provider/connected-provider.service';

@Injectable()
export class JiraService {
  constructor(
    private readonly httpService: HttpService,
    private readonly connectedProviderService: ConnectedProviderService,
  ) {}

  async getCloudId(userId: string): Promise<{ id: string }[]> {
    // https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/
    const { accessToken } =
      (await this.connectedProviderService.getUserConnectedCredential(
        userId,
        UserProvider.ATLASSIAN,
      )) || {};
    const resp = await lastValueFrom(
      this.httpService.get(
        'https://api.atlassian.com/oauth/token/accessible-resources',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );
    return resp.data;
  }

  async getAssignedTask(userId: string) {
    const { accessToken } =
      (await this.connectedProviderService.getUserConnectedCredential(
        userId,
        UserProvider.ATLASSIAN,
      )) || {};
    const [cloudId] = await this.getCloudId(userId);
    const {
      data: { sections },
    } = await lastValueFrom(
      this.httpService.get(
        `https://api.atlassian.com/ex/jira/${cloudId.id}/rest/api/2/issue/picker`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            currentJQL: 'assignee=currentUser()',
          },
        },
      ),
    );
    return sections[0].issues;
  }
}
