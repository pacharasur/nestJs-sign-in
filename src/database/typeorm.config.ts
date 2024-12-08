import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();
const configService = new ConfigService();
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT') || 5432,
  database: configService.get<string>('DB_NAME'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  entities: ['**/*.entity{ .ts,.js}'],
  migrations: ['**/dist/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: true,
};

const dataSource = new DataSource(dataSourceOptions);
dataSource
  .initialize()
  .then(async () => {
    console.log('Connection initialized with database...');
  })
  .catch((error) => console.log(error));

export default dataSource;
