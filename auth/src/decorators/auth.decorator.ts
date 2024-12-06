import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPE_KEY, AuthType } from '@my-rus-package/ticketing';

export const Auth = (type: AuthType) => SetMetadata(AUTH_TYPE_KEY, type);
