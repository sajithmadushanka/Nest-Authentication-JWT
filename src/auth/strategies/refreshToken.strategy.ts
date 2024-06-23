import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy,'refresh-token'){
    constructor(){
        super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey:    'secret',
        passReqToCallback: true,
        });

    }
    async validate(req:Request ,payload: any){
        const refreshToken = (req.headers['authorization']).replace('Bearer ','').trim();
        return{
            ...payload,
            refreshToken
        }
    }

}