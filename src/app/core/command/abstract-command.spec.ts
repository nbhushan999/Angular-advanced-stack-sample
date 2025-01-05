import { AbstractCommand } from './abstract-command';

describe('AbstractCommand', () => {

  let command: TestCommand;

  class TestCommand extends AbstractCommand {
  }

  beforeAll(() => {

    command = new TestCommand();

  });

  describe('getName', () => {

    it('should return name of command', () => {

      expect(command.getName()).toBe('TestCommand');

    });

  });

  describe('toString', () => {

    it('should return name of command', () => {

      expect(command + '').toBe('TestCommand');

    });

  });

});
