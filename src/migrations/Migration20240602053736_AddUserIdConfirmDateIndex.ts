import { Migration } from '@mikro-orm/migrations';

export class Migration20240602053736_AddUserIdConfirmDateIndex extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create index `idx_confirmHistory_userId_confirmDate` on `ConfirmHistory` (`user_id`, `confirm_date`);',
    );
  }
}
