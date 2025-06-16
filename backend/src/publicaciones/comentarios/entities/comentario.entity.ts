import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ collection: 'comentarios' })
export class Comentario {
  _id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'usuarios' })
  usuarioId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'publicaciones' })
  publicacionId: Types.ObjectId;

  @Prop({ required: true, type: Number })
  fecha: number;

  @Prop({ required: true, type: String })
  contenido: string;

  @Prop({ type: Boolean, default: false })
  eliminado: boolean;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);
export type ComentarioDocument = HydratedDocument<Comentario>;
