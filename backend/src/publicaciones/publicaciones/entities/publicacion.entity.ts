import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ collection: 'publicaciones' })
export class Publicacion {
  _id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  usuarioId: Types.ObjectId;

  @Prop({ required: true, type: Number })
  fecha: number; // timestamp

  @Prop({ required: true, type: String })
  titulo: string;

  @Prop({ required: true, type: String })
  contenido: string;

  @Prop({ required: false, type: String })
  urlImagen?: string;

  @Prop({
    type: [Types.ObjectId],
    default: new Array<Types.ObjectId>(),
    ref: 'usuarios',
  })
  likes: Types.ObjectId[]; // lista de id de usuarios

  @Prop({
    type: [Types.ObjectId],
    default: new Array<Types.ObjectId>(),
    ref: 'usuarios',
  })
  dislikes: Types.ObjectId[]; // lista de id de usuarios

  @Prop({ type: Boolean, default: false })
  eliminado: boolean;

  // los comentarios estan en otra coleccion
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);
export type PublicacionDocument = HydratedDocument<Publicacion>;
