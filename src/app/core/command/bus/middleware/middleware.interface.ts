import { InjectionToken } from '@angular/core';
import { CommandInterface } from '../../command.interface';
import { ResponseTypes } from '../../handler';

export interface MiddlewareInterface {

  execute(command: CommandInterface, next: Promise<ResponseTypes>): Promise<ResponseTypes>;

}

export const COMMAND_BUS_MIDDLEWARES: InjectionToken<MiddlewareInterface[]> =
  new InjectionToken('COMMAND_BUS_MIDDLEWARES');
