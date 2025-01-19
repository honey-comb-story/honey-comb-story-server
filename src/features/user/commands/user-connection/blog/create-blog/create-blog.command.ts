import { ICommand } from '@nestjs/cqrs';
import { Command, CommandProps } from '@libs/ddd/command.base';
import { AggregateID } from '@libs/ddd/entity.base';

export class CreateBlogCommand extends Command implements ICommand {
  readonly userId: AggregateID;
  readonly connectionId: AggregateID;
  readonly name: string;

  constructor(props: CommandProps<CreateBlogCommand>) {
    super(props);

    this.userId = props.userId;
    this.connectionId = props.connectionId;
    this.name = props.name;
  }
}
