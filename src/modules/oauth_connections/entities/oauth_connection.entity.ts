import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity('oauth_connections')
@Unique(['provider', 'provider_user_id']) // UNIQUE(provider, provider_user_id)
export class OauthConnectionEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: false })
    user_id: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    provider: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    provider_user_id: string;

    @Column({ type: 'text', nullable: true })
    access_token?: string;

    @Column({ type: 'text', nullable: true })
    refresh_token?: string;

    @Column({ type: 'timestamp', nullable: true })
    expires_at?: Date;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
