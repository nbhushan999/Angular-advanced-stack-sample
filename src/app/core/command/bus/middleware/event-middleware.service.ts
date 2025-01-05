import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommandInterface } from '../../command.interface';
import { CommandFailedEvent, CommandHandleEvent, CommandSucceededEvent } from '../../event';
import { ResponseTypes } from '../../handler';
import { EventBusService } from '../event-bus.service';
import { MiddlewareInterface } from './middleware.interface';

@Injectable()
export class EventMiddlewareService implements MiddlewareInterface {

  constructor(
    protected eventBus: EventBusService,
  ) {}

  public execute(command: CommandInterface, next: Promise<ResponseTypes | HttpErrorResponse>): Promise<ResponseTypes | HttpErrorResponse> {

    this.eventBus.emit(new CommandHandleEvent(command));

    return next.then(
      (res: ResponseTypes) => {

        this.eventBus.emit(new CommandSucceededEvent(command, res));

        return Promise.resolve(res);

      },
      (res: HttpErrorResponse) => {

        this.eventBus.emit(new CommandFailedEvent(command, res));

        return Promise.reject(res);

      },
    );

  }

}
