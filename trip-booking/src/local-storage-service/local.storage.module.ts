/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { RequestLocalStorageService } from './request.local.storage.service';

@Global()
@Module({
  providers: [RequestLocalStorageService],
  exports: [RequestLocalStorageService],
})
export class ContextModule {}
