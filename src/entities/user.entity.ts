import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ulid } from 'ulid';

@Entity({ tableName: 'User' })
export class UserEntity {
  @PrimaryKey({ type: 'varchar', length: 100 })
  id: string = ulid();

  @Property({ type: 'varchar', length: 100 })
  githubId: string;

  @Property({ type: 'varchar', length: 100 })
  discordId: string;

  @Property({ type: 'int' })
  streak: number = 0;

  @Property({ type: 'timestamp' })
  createdAt: Date = new Date();

  constructor(githubId: string, discordId: string) {
    this.githubId = githubId;
    this.discordId = discordId;
  }
}
