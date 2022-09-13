import { Repository } from 'typeorm';

import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDTO, LoginUserDTO } from './dto';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async createUser(createUserDTO: CreateUserDTO) {
    
    try {
      
      const {password, ...userData} = createUserDTO;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password,10)
      });

      await this.userRepository.save(user);

      return user;

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async login(loginUserDTO: LoginUserDTO){


      const {password, email} = loginUserDTO;

      const user = await this.userRepository.findOne({where:{email}, select: {email:true, password:true}});

      if(!user)
        throw new UnauthorizedException('Credentials ara not valid')
      
      if(!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('Credentials ara not valid') 

      return user;
 
  }

  findAll() {
    return `This action returns all auth`;
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