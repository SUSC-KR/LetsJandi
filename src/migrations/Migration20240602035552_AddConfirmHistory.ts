import { Migration } from '@mikro-orm/migrations';

export class Migration20240602035552_AddConfirmHistory extends Migration {
  async up(): Promise<void> {
    this.addSql(
      [
        'create table `ConfirmHistory` (',
        '`id` varchar(100) not null,',
        '`user_id` varchar(100) not null,',
        '`confirm_date` timestamp not null,',
        '`created_at` timestamp not null,',
        'primary key (`id`)',
        ');',
      ].join(' '),
    );
  }
}
