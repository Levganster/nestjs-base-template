import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const DecodeUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user;
  },
);

export const DecodeUserWs = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    return context.switchToWs().getClient().data.user;
  },
);
