export type GetUserContributionInfoDto = {
  user: {
    contributionsCollection: {
      hasAnyContributions: boolean;
      hasAnyRestrictedContributions: boolean;
    };
  };
};
