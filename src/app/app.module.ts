import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ReportsModule } from '../reports/reports.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module';
import { User } from '../users/entities/user.entity';
import { Report } from '../reports/entities/report.entity';

@Module({
  imports: [
    TypeOrmCoreModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Report],
      synchronize: true,
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
