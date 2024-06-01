import { Type } from '@susc/common/types';

export const RepositoryMetadataKey = '@lets-jandi/Repository';
export type RepositoryMetadata = {
  propertyKey: string | symbol;
  entity: Type<any>;
}[];

export const Repository = (entity: Type<any>): PropertyDecorator => {
  return (target: any, propertyKey: string | symbol): void => {
    const metadata: RepositoryMetadata =
      Reflect.getMetadata(RepositoryMetadataKey, target) || [];
    metadata.push({ propertyKey, entity });
    Reflect.defineMetadata(RepositoryMetadataKey, metadata, target);
  };
};
