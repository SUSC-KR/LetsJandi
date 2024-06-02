import { Migration } from '@mikro-orm/migrations';

export class Migration20240601182920_AddUser extends Migration {
  async up(): Promise<void> {
    this.addSql(
      [
        'CREATE TABLE `User` (',
        '`id` varchar(100) not null,',
        '`github_id` varchar(100) not null,',
        '`discord_id` varchar(100) not null,',
        '`created_at` timestamp not null,',
        'primary key (`id`)',
        ');',
      ].join(' '),
    );
  }
}
