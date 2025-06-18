import { Module } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ImagenesUtils } from './utils/imagenes.utils';

@Module({
  providers: [SupabaseService, ImagenesUtils],
  exports: [ImagenesUtils],
})
export class UtilsModule {}
