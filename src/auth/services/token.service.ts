import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) {}
    async getToken(id: number, email: string) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                { id, email },
                {
                    secret: 'secret',
                    expiresIn: 60 * 15,
                },
            ),
            this.jwtService.signAsync(
                { id, email },
                {
                    secret: 'secret',
                    expiresIn: 60 * 60 * 24 * 7,
                },
            ),
        ]);

        return {
            accessToken: at,
            refreshToken: rt,
        };
    }
}