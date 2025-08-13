/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { I18nModule, AcceptLanguageResolver, HeaderResolver, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: join(__dirname, '../i18n/'), 
          watch: true,
          includeSubfolders: true,
        },
        typesOutputPath: join(process.cwd(), 'src/generated/i18n.generated.ts'),
      }),
      resolvers: [
        AcceptLanguageResolver,  // Postman Accept-Language
        new HeaderResolver(['x-custom-lang']),
        new QueryResolver(['lang']), // for ?lang=sr
      ],
    }),
  ],
  exports: [I18nModule],
})
export class I18nConfigModule {}
