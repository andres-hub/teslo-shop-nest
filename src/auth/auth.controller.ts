import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as request from 'supertest';

import { AuthService } from './auth.service';
import { CreateUserDTO, LoginUserDTO } from './dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/get-row-headers.decorator';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.createUser(createUserDTO);
  }

  @Post('login')
  login(@Body() loginUserDTO: LoginUserDTO) {
    return this.authService.login(loginUserDTO);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    // @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[]
  ) {
    // // console.log(request.user)
    // console.log(user)
    // console.log(userEmail)
    return { 
      ok: true, 
      menssage: `Hola mundo`,
      user,
      userEmail,
      rawHeaders,
      request
   };
    // return this.authService.testingPrivateRoute();
  }
  
  // @SetMetadata('roles', ['admin', 'seper-user'])
  @Get('private2')
  @RoleProtected(ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRoute2(
    @GetUser() user: User  ) {
    return { 
      ok: true, 
      menssage: `Hola mundo`,
      user,
      // userEmail,
      // rawHeaders,
      // request
   };
  }

  @Get('private3')
  @Auth(ValidRoles.user)
  testingPrivateRoute3(
    @GetUser() user: User  ) {
    return { 
      ok: true, 
      menssage: `Hola mundo`,
      user,
      // userEmail,
      // rawHeaders,
      // request
   };
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
