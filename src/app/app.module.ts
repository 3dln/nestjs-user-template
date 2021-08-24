import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ReportsModule } from '../reports/reports.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Report } from '../reports/entities/report.entity';
import { User } from '../users/entities/user.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmCoreModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [User, Report],
        };
      },
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieSession({ keys: ['s0m37e7yOdD$t71n9Wh0Know$Wh@t'] }))
      .forRoutes('*');
  }
}
