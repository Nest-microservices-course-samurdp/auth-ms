import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { RegisterUserDto as LoginUserDto } from './dto';


import * as bcript from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { envs } from 'src/config';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('AuthService');



    constructor(
        private readonly jwtService: JwtService
    ) {
        super();
    }

    onModuleInit() {
        this.$connect();
        this.logger.log('Database connected');
    }

    async signJWT(payload: JwtPayload) {
        return this.jwtService.sign(payload)
    }
    async verifyToken(token: string) {
        try {
            const { sub, iat, exp, ...payload } = this.jwtService.verify(token, {
                secret: envs.SECRET_JWT
            })
            return {
                user: payload,
                token: await this.signJWT(payload),
            }
        } catch (error) {
            throw new RpcException({
                status: 401,
                message: "Invalid token"
            })
        }
    }

    async registerUser(registerUserDto: LoginUserDto) {
        try {
            const isUser = await this.user.findUnique({
                where: {
                    email: registerUserDto.email
                }
            })

            if (isUser) {
                throw new RpcException({
                    status: 400,
                    message: 'User already exists'
                })
            }

            const { password: __, ...newUser } = await this.user.create({
                data: {
                    email: registerUserDto.email,
                    password: bcript.hashSync(registerUserDto.password, 10)
                }
            })
            return {
                user: newUser,
                token: await this.signJWT(newUser)
            }

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message
            })
        }
    }


    async loginUserCredentials(loginUserDto: LoginUserDto) {
        try {
            const { email, password } = loginUserDto

            const isUser = await this.user.findUnique({
                where: {
                    email: email
                }
            })

            if (!isUser) {
                throw new RpcException({
                    status: 400,
                    message: 'Invalid credentials'
                })

            }

            const isPasswordValid = bcript.compareSync(password, isUser.password)


            if (!isPasswordValid) {
                throw new RpcException({
                    status: 400,
                    message: 'Invalid credentials'
                })
            }

            const { password: __, ...newUser } = isUser

            return {
                user: newUser,
                token: await this.signJWT(newUser)
            }

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message,
            })
        }
    }

}
