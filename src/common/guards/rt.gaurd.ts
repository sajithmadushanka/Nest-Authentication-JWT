import { AuthGuard } from "@nestjs/passport";

export class RtGaurd extends AuthGuard('refresh-token'){
    constructor(){
        super()
    }
}