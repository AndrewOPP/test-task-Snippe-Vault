import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SnippetsModule } from './snippets/snippets.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI as string), SnippetsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
