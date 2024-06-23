
import { Controller, Get, Post, Body, Patch, Param, Delete, Response, UseGuards, Request, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { AtGaurd, RtGaurd } from 'src/common/guards';
import { GetCurrentUser, GetCurrentUserID } from 'src/common/decorators';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/signup')
  localSignUp(@Body() authDto:AuthDto):Promise<Tokens> {
   return  this.authService.localSignUp(authDto);
  }

  @Post('local/signin')
  localSignIn(@Body() authDto:AuthDto ) :Promise<Tokens>{
    return this.authService.localSignIn(authDto);
  }


  @Post('logout')
  @UseGuards(AtGaurd)
  logout(@GetCurrentUserID() userId) {
     return this.authService.logout(userId);
  }

  @Post('refresh')
  @UseGuards(RtGaurd)
  refreshToken(@GetCurrentUser('id') id:number, @GetCurrentUser('refreshToken') refreshToken:string) {
    return this.authService.refreshToken(id, refreshToken);
  }


}