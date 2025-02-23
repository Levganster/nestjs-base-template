import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();

    try {
      const user = await super.canActivate(context);
      if (user) {
        client.data.user = await super.handleRequest(null, user, null, null);
        return true;
      }
      return false;
    } catch (err) {
      await this.handleError(client);
      return false;
    }
  }

  getRequest(context: ExecutionContext) {
    const wsContext = context.switchToWs();
    const client = wsContext.getClient<Socket>();

    const authToken = this.extractTokenFromHandshake(client);

    return {
      headers: {
        authorization: authToken,
      },
    };
  }

  handleRequest<T>(err: Error | null, user: T): T {
    if (err || !user) {
      const i18n = I18nContext.current();
      throw new Error(i18n?.t('errors.unauthorized') || 'Unauthorized');
    }
    return user as T;
  }

  private extractTokenFromHandshake(client: Socket): string | null {
    const authHeader = client.handshake.headers.authorization;
    return authHeader;
  }

  private async handleError(client: Socket) {
    const i18n = I18nContext.current();
    client.emit('error', {
      message: i18n?.t('errors.unauthorized') || 'Unauthorized',
    });
    client.disconnect();
  }
}
