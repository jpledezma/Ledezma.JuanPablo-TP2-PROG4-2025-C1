import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ collection: 'usuarios' })
export class Usuario {
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  nombre: string;

  @Prop({ required: true, type: String })
  apellido: string;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({ required: true, type: String, unique: true })
  username: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: true, type: Number })
  fechaNacimiento: number;

  @Prop({
    type: String,
    default:
      'https://vrlutnnbbolhygfyvnmk.supabase.co/storage/v1/object/public/red-social/fotos-perfil/default_pfp.jpeg',
  })
  urlFotoPerfil: string;

  @Prop({
    type: String,
    default:
      'https://vrlutnnbbolhygfyvnmk.supabase.co/storage/v1/object/public/red-social/thumbnails/default_pfp.thumbnail.jpeg',
  })
  urlFotoThumbnail: string;

  @Prop({ required: false, type: String, maxlength: 255 })
  descripcion?: string;

  @Prop({ required: false, type: String, default: 'usuario' })
  acceso?: string;

  @Prop({ required: true, type: Number })
  createdAt: number;

  @Prop({ type: Boolean, default: false })
  eliminado: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
export type UsuarioDocument = HydratedDocument<Usuario>;
