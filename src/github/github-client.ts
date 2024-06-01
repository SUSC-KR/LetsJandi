import axios, { AxiosInstance } from 'axios';

import { config } from '@susc/config';
import { UserQueryDto } from '@susc/github/dto/user-query.dto';
import { GetUserDto } from '@susc/github/dto/get-user.dto';
import { GetUserContributionInfoDto } from '@susc/github/dto/get-user-contribution-info.dto';
import dayjs from 'dayjs';

export class GithubClient {
  client: AxiosInstance;

  constructor() {
    const token = config.github.token;
    this.client = axios.create({
      baseURL: 'https://api.github.com/graphql',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getUser(githubId: string): Promise<GetUserDto> {
    const query = `
      query userInfo($login: String!) {
        user(login: $login) {
          login
          name
          bio
          avatarUrl
          url
        }
      }
    `;

    const { data } = await this.client.post<UserQueryDto<GetUserDto>>('', {
      query,
      variables: { login: githubId },
    });
    return data.data.user;
  }

  async getContribution(githubId: string): Promise<GetUserContributionInfoDto> {
    const query = `
      query userInfo($login: String!, $date: DateTime!) {
        user(login: $login) {
          contributionsCollection(from: $date) {
            hasAnyContributions,
            hasAnyRestrictedContribution
          }
        }
      }
    `;

    const startOfToday = dayjs().tz('Asia/Seoul').startOf('day').toISOString();
    const { data } = await this.client.post<
      UserQueryDto<GetUserContributionInfoDto>
    >('', {
      query,
      variables: { login: githubId },
    });
    return data.data.user;
  }
}
