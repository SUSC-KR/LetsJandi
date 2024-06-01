import { Migration } from '@mikro-orm/migrations';

export class AddUser20240601182920 extends Migration {
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
      ].join(' ')
    );
  }
}
