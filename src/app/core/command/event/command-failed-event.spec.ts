import { HttpErrorResponse } from '@angular/common/http';
import { AbstractCommand } from '../abstract-command';
import { CommandFailedEvent } from './command-failed-event';

describe('CommandFailedEvent', () => {

  let commandFailedEvent: CommandFailedEvent;
  let command: TestCommand;
  const error: HttpErrorResponse = {
    name: null,
    message: '',
    error: 'error',
    ok: false,
    headers: null,
    status: 2,
    statusText: '',
    url: '',
    type: null,
  };

  class TestCommand extends AbstractCommand {
  }

  beforeAll(() => {

    command = new TestCommand();
    commandFailedEvent = new CommandFailedEvent(command, error);

  });

  describe('getException', () => {

    it('should return exception', () => {

      expect(commandFailedEvent.getException()).toBe(error);

    });

  });

});
