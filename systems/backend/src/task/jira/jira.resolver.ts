import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import type { TokenUserPayload } from '../../auth/token-user-payload';
import { User } from '../../auth/user.decorator';
import { JiraAssignedTask } from './jira.model';
import { JiraService } from './jira.service';

@Resolver()
export class JiraResolver {
  constructor(private readonly jiraService: JiraService) {}

  @Query(() => [JiraAssignedTask])
  @UseGuards(JwtAuthGuard)
  async jiraAssignedTask(@User() user: TokenUserPayload) {
    return this.jiraService.getAssignedTask(user.userId);
  }
}
