import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Options, SqliteDriver } from '@mikro-orm/sqlite';

const config: Options = {
  driver: SqliteDriver,
  dbName: 'data.db',
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  extensions: [Migrator],
  migrations: {
    tableName: 'Migrations',
    path: './src/migrations',
    pathTs: './src/migrations',
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
  ...(process.env.NODE_ENV !== 'production'
    ? { metadataProvider: TsMorphMetadataProvider, debug: true }
    : {}),
};

export default config;
