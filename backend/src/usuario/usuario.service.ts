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
    const instancia = new this.usuarioModel(usuarioDto);
    const guardado = await instancia.save();

    return guardado;
  }

  findAll() {
    return `This action returns all usuario`;
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

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
