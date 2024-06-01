export const GetGithubClientMetadataKey = '@lets-jandi/GetGithubClient';
export type GetGithubClientMetadata = {
  propertyKey: string | symbol;
}[];

export const GetGithubClient = (): PropertyDecorator => {
  return (target: any, propertyKey: string | symbol): void => {
    const metadata: GetGithubClientMetadata =
      Reflect.getMetadata(GetGithubClientMetadataKey, target) || [];
    metadata.push({ propertyKey });
    Reflect.defineMetadata(GetGithubClientMetadataKey, metadata, target);
  };
};
