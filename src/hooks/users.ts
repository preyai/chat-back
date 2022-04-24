import { Hook, HookContext } from '@feathersjs/feathers';
import fetch from 'node-fetch';

export const onCreate = ():Hook => {
  return async (context: HookContext) => {


    const url = 'https://randomfox.ca/floof/';
    const res = await fetch(url);
    const fox:any = await res.json();
    context.data['avatar'] = fox.image;
    
    return context;
  };
};