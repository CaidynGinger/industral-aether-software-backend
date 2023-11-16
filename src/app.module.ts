import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SectorsModule } from './sectors/sectors.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectsModule } from './objects/objects.module';
import { ProductionLinesModule } from './production-lines/production-lines.module';
import { APP_PIPE } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://21100204:F6XPSxq5rta4k7W@ias-cluster0.umyiaow.mongodb.net/?retryWrites=true&w=majority',
    ),
    SectorsModule,
    ObjectsModule,
    ProductionLinesModule,
    UsersModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },],
})
export class AppModule {}
