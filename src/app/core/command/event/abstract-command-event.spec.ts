import { AbstractCommand } from '../abstract-command';
import { AbstractCommandEvent } from './abstract-command-event';

describe('AbstractCommandEvent', () => {

  let testCommandEvent: AbstractCommandEvent;
  let command: TestCommand;

  class TestCommand extends AbstractCommand {
  }

  class TestCommandEvent extends AbstractCommandEvent {
  }

  beforeAll(() => {

    command = new TestCommand();
    testCommandEvent = new TestCommandEvent(command);

  });

  describe('getCommand', () => {

    it('should return command of event', () => {

      expect(testCommandEvent.getCommand()).toBe(command);

    });

  });

  describe('getCommandName', () => {

    it('should return command name of event', () => {

      expect(testCommandEvent.getCommandName()).toBe('TestCommand');

    });

  });

});
