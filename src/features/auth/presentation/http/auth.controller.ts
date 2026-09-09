import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';

import {
  AuthService,
} from '../../application/auth.service.js';

import {
  LoginDto,
} from './dto/login.dto.js';
import { Public } from '../../../../core/authorization/decorators/public.decorator.js';
import type { Response as ExpressResponse } from 'express';
import { ResponseUtil } from '../../../../shared/utils/response.js';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res() res: ExpressResponse) {
    const data = await this.authService.login(dto);
    console.log('data', data);

    return new ResponseUtil(res).success(data, 'User force deleted successfully', ResponseUtil.HTTP_OK);
  }
}