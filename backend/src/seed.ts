import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Snippet, SnippetDocument, SnippetType } from './snippets/schemas/snippet.schema';

async function bootstrap() {
  console.log('🌱 Starting seeder...');

  const app = await NestFactory.createApplicationContext(AppModule);

  const snippetModel = app.get<Model<SnippetDocument>>(getModelToken(Snippet.name));

  console.log('🗑️ Clearing existing snippets...');
  await snippetModel.deleteMany({});

  console.log('📝 Generating 45 snippets...');
  const snippets: Partial<Snippet>[] = [];

  const types = Object.values(SnippetType);

  const possibleTags = [
    'react',
    'nextjs',
    'nestjs',
    'typescript',
    'mongodb',
    'docker',
    'css',
    'git',
  ];

  for (let i = 1; i <= 45; i++) {
    const randomTags = possibleTags
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 2) + 1);

    const randomType = types[Math.floor(Math.random() * types.length)];

    snippets.push({
      title: `Awesome Snippet #${i}`,
      content: `Auto-generated content for snippet ${i};`,
      type: randomType,
      tags: randomTags,
    });
  }

  await snippetModel.insertMany(snippets);

  console.log('✅ Successfully seeded 45 snippets!');

  await app.close();
}

bootstrap();
