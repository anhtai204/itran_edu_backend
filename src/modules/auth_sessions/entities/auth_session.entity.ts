import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('auth_sessions')
export class AuthSessionEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: false })
    user_id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    token: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    refresh_token?: string;

    @Column({ type: 'jsonb', nullable: true })
    device_info?: Record<string, any>;

    @Column({ type: 'varchar', length: 45, nullable: true })
    ip_address?: string;

    @Column({ type: 'timestamp', nullable: false })
    expires_at: Date;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}
