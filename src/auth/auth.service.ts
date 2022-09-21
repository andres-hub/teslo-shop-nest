import { Repository } from 'typeorm';

import {JwtService} from '@nestjs/jwt';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDTO, LoginUserDTO } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ){}

  async createUser(createUserDTO: CreateUserDTO) {
    
    try {
      
      const {password, ...userData} = createUserDTO;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password,10)
      });

      await this.userRepository.save(user);

      return {
        ...user,
        token: this.getJwtToken({id: user.id})
      };

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async login(loginUserDTO: LoginUserDTO){


      const {password, email} = loginUserDTO;

      const user = await this.userRepository.findOne({where:{email}, select: {email:true, password:true, id:true}});

      if(!user)
        throw new UnauthorizedException('Credentials ara not valid')
      
      if(!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('Credentials ara not valid') 

      

      return {
        ...user,
        token: this.getJwtToken({id: user.id})
      };
 
  }

  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

  testingPrivateRoute() {
    return { 
       ok: true, 
       menssage: `Hola mundo`
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  private handleDBExceptions(error: any): never{
    
    console.log(error)
    if(error.code === '23505')
        throw new BadRequestException(error.detail);
        
      this.logger.error(error);
      throw new InternalServerErrorException("Help");
  }
  
}
