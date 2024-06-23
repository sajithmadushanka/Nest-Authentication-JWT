import { AuthGuard } from "@nestjs/passport";

export class AtGaurd extends AuthGuard('jwt'){
    constructor(){
        super()
    }
}