import { HookContext, Query } from '@feathersjs/feathers';
import { Users } from '../services/users/users.class';

export const onCreate = () => {
  return async (context: HookContext) => {
    
    context.data.users = [context.params.user];
    context.data.owner = context.params.user;
    
    return context;
  };
};

export const protect = () => {
  return async (context: HookContext) => {
    if (context.id && context.params.user) {
      const chat = await context.service.get(context.id);
      if (!context.params.user._id.equals(chat.owner))
        throw new Error('No access');
    }
    
    return context;
  };
};