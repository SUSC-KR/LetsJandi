import { Options, SqliteDriver } from '@mikro-orm/sqlite';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations';

const config: Options = {
  driver: SqliteDriver,
  dbName: 'data.db',
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  metadataProvider: TsMorphMetadataProvider,
  extensions: [Migrator],
  migrations: {
    tableName: 'Migrations',
    path: './migrations',
    pathTs: undefined,
    glob: '!(*.d).{js,ts}',
    transactional: true,
    disableForeignKeys: true,
    allOrNothing: true,
    dropTables: false,
    safe: true,
    snapshot: false,
    emit: 'ts',
    generator: TSMigrationGenerator,
  },
  debug: true,
};

export default config;
