import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SnippetsModule } from './snippets/snippets.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:rootpassword@localhost:27017/snippet_db?authSource=admin',
    ),
    SnippetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
