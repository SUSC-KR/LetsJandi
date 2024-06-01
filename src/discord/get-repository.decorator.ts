import { Type } from '@susc/common/types';

export const GetRepositoryMetadataKey = '@lets-jandi/GetRepository';
export type GetRepositoryMetadata = {
  propertyKey: string | symbol;
  entity: Type<any>;
}[];

export const GetRepository = (entity: Type<any>): PropertyDecorator => {
  return (target: any, propertyKey: string | symbol): void => {
    const metadata: GetRepositoryMetadata =
      Reflect.getMetadata(GetRepositoryMetadataKey, target) || [];
    metadata.push({ propertyKey, entity });
    Reflect.defineMetadata(GetRepositoryMetadataKey, metadata, target);
  };
};
