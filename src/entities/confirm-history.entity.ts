import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/core';
import { ulid } from 'ulid';

@Entity({ tableName: 'ConfirmHistory' })
@Index({
  name: 'idx_confirmHistory_userId_confirmDate',
  properties: ['userId', 'confirmDate'],
})
export class ConfirmHistoryEntity {
  @PrimaryKey({ type: 'varchar', length: 100 })
  id: string = ulid();

  @Property({ type: 'varchar', length: 100 })
  userId: string;

  @Property({ type: 'timestamp' })
  confirmDate: Date;

  @Property({ type: 'timestamp' })
  createdAt: Date = new Date();

  constructor(userId: string, confirmDate: Date) {
    this.userId = userId;
    this.confirmDate = confirmDate;
  }
}
