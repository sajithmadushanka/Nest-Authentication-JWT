


import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { hashData, compareHash } from 'src/utils';
import { Tokens } from './types';

import { TokenService } from './services/token.service';



@Injectable()
export class AuthService {

  constructor(
    private prismaService:PrismaService,
    private tokenService:TokenService
  ){}

  //---------------------------
async updateRtHash(id:number, rt:string) {
    const hashRefreshToken = await hashData(rt);
    await this.prismaService.user.update({
        where:{
            id
        },
        data:{
            hashRefreshToken
        }
    })
    
}

//----------------------------


  async localSignUp(authDto:AuthDto) :Promise<Tokens> {
    const hashPassword = await hashData(authDto.password);
    const isUserExist = await this.prismaService.user.findUnique({
      where:{
        email:authDto.email
      }
    });
    if(isUserExist){
      throw new ConflictException('User already exists');
    }

    const newUser = await this.prismaService.user.create({
      data:{
        email:authDto.email,
        hashPassword:hashPassword
      }
    });

    const tokens = await this.tokenService.getToken(newUser.id,newUser.email);
    await this.updateRtHash(newUser.id,tokens.refreshToken);
    return tokens;
  }

 async localSignIn(authDto:AuthDto):Promise<Tokens> {
    const user = await this.prismaService.user.findUnique(
      {
        where:{email:authDto.email},
        
      }
    )
    if(!user){
      throw new  ConflictException('User not found');
    }
    const token  = await this.tokenService.getToken(user.id, user.email);
   await this.updateRtHash(user.id, token.refreshToken)

    return token;
  }

  async logout(userId:number):Promise<string> {
    console.log("-------",userId)
   const result =  await this.prismaService.user.updateMany({
      where:{
        id:userId,
        hashRefreshToken:{not:null}
      },
      data:{hashRefreshToken:null}
    })

    if(!result) return "unable to logout"
    return "logout success"
  }

  async refreshToken(userId:number, rt:string):Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where:{id:userId}
    })
    if(!user) throw new ConflictException("user not found")
    
    const isMatch = await compareHash(rt, user.hashRefreshToken);
   
    if( !isMatch ){
      throw new ConflictException("refresh token invalid")
    }
      const token = await this.tokenService.getToken(user.id, user.email)
      await this.updateRtHash(userId, rt);
      return token;
  }

}