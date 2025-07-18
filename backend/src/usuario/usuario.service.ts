import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel(Usuario.name)
    private usuarioModel: Model<Usuario>,
  ) {}

  async create(usuarioDto: CreateUsuarioDto) {
    const instancia = new this.usuarioModel({
      ...usuarioDto,
      createdAt: Date.now(),
    });
    const guardado = await instancia.save();

    return guardado;
  }

  async findAll() {
    const usuarios = await this.usuarioModel.find({}, { password: 0 }); // sacar eliminados
    return usuarios;
  }

  async findById(id: string) {
    const usuario = await this.usuarioModel.findOne(
      { _id: id },
      { password: 0 },
    );
    return usuario;
  }

  async findByUsername(username: string) {
    const usuario = await this.usuarioModel.findOne({
      username: username,
      eliminado: false,
    });
    return usuario;
  }

  async findByEmail(email: string) {
    const usuario = await this.usuarioModel.findOne({
      email: email,
      eliminado: false,
    });
    return usuario;
  }

  async update(id: Types.ObjectId, updateUsuarioDto: UpdateUsuarioDto) {
    const resultado = await this.usuarioModel.updateOne(
      { _id: id },
      updateUsuarioDto,
    );
    return resultado;
  }

  async remove(id: Types.ObjectId) {
    const resultado = await this.usuarioModel.updateOne(
      { _id: id },
      { eliminado: true },
    );
    return resultado;
  }

  async restore(id: Types.ObjectId) {
    const resultado = await this.usuarioModel.updateOne(
      { _id: id },
      { eliminado: false },
    );
    return resultado;
  }
}
