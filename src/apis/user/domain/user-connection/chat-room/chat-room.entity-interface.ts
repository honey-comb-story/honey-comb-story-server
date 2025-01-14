import { AggregateID } from '@src/libs/ddd/entity.base';

export interface ChatRoomProps {
  createdBy: AggregateID;
  connectionId: AggregateID;
  name: string;
  deletedAt: Date | null;
}

export interface CreateChatRoomProps {
  createdBy: AggregateID;
  connectionId: AggregateID;
  name: string;
}
