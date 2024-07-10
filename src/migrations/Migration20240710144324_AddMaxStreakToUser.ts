import { Migration } from '@mikro-orm/migrations';

export class Migration20240710144324_AddMaxStreakToUser extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `User` add column `max_streak` integer not null default 0;',
    );
  }
}
