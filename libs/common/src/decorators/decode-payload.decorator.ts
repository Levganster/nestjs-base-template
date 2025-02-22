import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const DecodePayload = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user;
  },
);
