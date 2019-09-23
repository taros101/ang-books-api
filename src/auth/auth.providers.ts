
import { UserSchema } from '../users/users.schema';

export const authProviders = [
  {
    provide: 'AUTH_REPOSITORY',
    useValue: UserSchema,
  },
];