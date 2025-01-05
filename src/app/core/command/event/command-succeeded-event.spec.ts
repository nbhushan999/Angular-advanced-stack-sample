import { AbstractCommand } from '../abstract-command';
import { CommandSucceededEvent } from './command-succeeded-event';

describe('CommandSucceededEvent', () => {

  let commandSucceededEvent: CommandSucceededEvent;
  let command: TestCommand;
  const successResult = {message: 'data'};

  class TestCommand extends AbstractCommand {
  }

  beforeAll(() => {

    command = new TestCommand();
    commandSucceededEvent = new CommandSucceededEvent(command, successResult);

  });

  describe('getResult', () => {

    it('should return result', () => {

      expect(commandSucceededEvent.getResult()).toBe(successResult);

    });

  });

});
