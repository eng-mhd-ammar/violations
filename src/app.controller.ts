import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { Public } from './core/authorization/decorators/public.decorator.js';
import { db } from './prisma/db.js';
import { PrismaService } from './core/database/prisma.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  async getHello() {
    // const users = await db.orm.public.User
    // .where((user) =>
    //     user.userRoles.some((userRole) =>
    //         userRole.role.some((role) =>
    //             role.slug.eq('police_officer'),
    //         ),
    //     ),
    // )
    // .all();
    
    // return users;

    // return (new PrismaService).db.orm.public.User.all();
    return this.appService.getHello();
  }
}
