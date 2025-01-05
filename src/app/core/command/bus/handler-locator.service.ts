import { Injectable, Injector } from '@angular/core';
import { CommandInterface } from '../command.interface';
import { CreateTokenCommand } from '../create-token-command';
import * as handler from '../handler';
import { HandlerInterface } from '../handler/handler.interface';
import { RemoveTokenCommand } from '../remove-token-command';
import { HandlerLocatorInterface } from './handler-locator.interface';

@Injectable()
export class HandlerLocatorService implements HandlerLocatorInterface {

  constructor(
    private injector: Injector,
  ) {

  }

  public getHandlerForCommand(command: CommandInterface): HandlerInterface {

    switch (true){

      case command instanceof CreateTokenCommand:
        return this.injector.get(handler.CreateTokenHandler);

      case command instanceof RemoveTokenCommand:
        return this.injector.get(handler.RemoveTokenHandler);

    }

    throw new Error(`HandlerLocatorService: Unable to get handler for command ${command.getName()}.`);

  }

}
