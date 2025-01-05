import { HttpErrorResponse } from '@angular/common/http';
import { CommandInterface } from '../command.interface';
import { AbstractCommandEvent } from './abstract-command-event';

export class CommandFailedEvent extends AbstractCommandEvent {

  constructor(
    protected command: CommandInterface,
    private exception: HttpErrorResponse,
  ) {
    super(command);
  }

  public getException(): HttpErrorResponse {

    return this.exception;

  }

}
