import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CommandInterface } from '../../command/command.interface';
import { ResponseTypes } from '../../command/handler/handler.interface';
import { CommandBusInterface } from './command-bus.interface';
import { HandlerLocatorService } from './handler-locator.service';
import { COMMAND_BUS_MIDDLEWARES, MiddlewareInterface } from './middleware/middleware.interface';

@Injectable()
export class CommandBusService implements CommandBusInterface {

  constructor(
    private locator: HandlerLocatorService,
    @Inject(COMMAND_BUS_MIDDLEWARES) private middlewares,
  ) {

  }

  public handle(command: CommandInterface): Promise<ResponseTypes | HttpErrorResponse> {

    let result = this.locator.getHandlerForCommand(command).handle(command);

    this.middlewares.forEach((middleware: MiddlewareInterface) => {
      result = middleware.execute(command, result);
    });

    return result;

  }

}
