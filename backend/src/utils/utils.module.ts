import { Module } from '@nestjs/common';
import { ImagenesUtils } from './utils/imagenes.utils';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  providers: [SupabaseService, ImagenesUtils],
  exports: [ImagenesUtils],
})
export class UtilsModule {}
