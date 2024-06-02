import { Migration } from '@mikro-orm/migrations';

export class Migration20240602051319_AddStreakToUser extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `User` add column `streak` integer not null default 0;',
    );
  }
}
