import { CommandInterface } from '../../command/command.interface';
import { HandlerInterface } from '../../command/handler/handler.interface';

export interface HandlerLocatorInterface {

  getHandlerForCommand(command: CommandInterface): HandlerInterface;

}
