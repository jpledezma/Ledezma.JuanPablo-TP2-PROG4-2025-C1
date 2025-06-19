import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './entities/usuario.entity';
import { Model, Types } from 'mongoose';

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
    const usuarios = await this.usuarioModel.find(); // sacar eliminados
    return usuarios;
  }

  async findById(id: string) {
    const usuario = await this.usuarioModel.findOne({ _id: id });
    return usuario;
  }

  async findByUsername(username: string) {
    const usuario = await this.usuarioModel.findOne({ username: username });
    return usuario;
  }

  async findByEmail(email: string) {
    const usuario = await this.usuarioModel.findOne({ email: email });
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
}
