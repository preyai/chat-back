import { HookContext, Query } from '@feathersjs/feathers';

export const onCreate = () => {
  return async (context: HookContext) => {
    
    context.data.user = context.params.user;
    
    return context;
  };
};

export const filter = () => {
  return async (context: HookContext) => {
    const chatId = (context.params.query as Query).chat;
    const user = context.params.user;

    if (!chatId || !user)
      throw new Error('No chat');

    const chat = await context.app.service('chats').get(chatId);
    
    if (!chat.users.find((u:any)=>u._id.equals(user._id))) {
      if (chat.private)
        throw new Error('No access');
      chat.users.push(user._id);
      await context.app.service('chats').patch(chatId, {users:chat.users});
    }
      
    return context;
  };
};

export const populate = () => {
  return async (context:HookContext) => {
    const { app, method, result, params } = context;

    const addUser = async (message:any) => {
      const user = await app.service('users').get(message.user, params);

      return {
        ...message,
        user
      };
    };

    if (method === 'find') {
      context.result.data = await Promise.all(result.data.map(addUser));
    } else {
      context.result = await addUser(result);
    }

    return context;
  };
};
