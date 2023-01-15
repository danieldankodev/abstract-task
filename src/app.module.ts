import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RubacModule } from './rubac/rubac.module';
import { AuthMiddleware } from './app.middleware';
import { UserModule } from './user/user.module';

@Module({
  imports: [RubacModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)
        // .forRoutes('admin/*');
      /** @description Giving rubac service responsibility of applying workflow logic depending on all routes **/
       .forRoutes('*');
  }
}
