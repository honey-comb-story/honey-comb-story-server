import { AggregateID } from '@libs/ddd/entity.base';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseResponseDto,
  CreateBaseResponseDtoProps,
} from '@src/libs/api/dtos/response/base.response-dto';

export interface CreateChatMessageResponseDtoProps
  extends CreateBaseResponseDtoProps {
  roomId: AggregateID;
  senderId: AggregateID;
  message: string;
  blogUrl: string | null;
}

export class ChatMessageResponseDto
  extends BaseResponseDto
  implements Omit<CreateBaseResponseDtoProps, keyof CreateBaseResponseDtoProps>
{
  @ApiProperty({
    example: 668734709767935546n,
    description: '채팅방 ID',
  })
  readonly roomId: AggregateID;

  @ApiProperty({
    example: 668734709767935546n,
    description: '메시지를 보낸 유저 ID',
  })
  readonly senderId: AggregateID;

  @ApiProperty({
    example: '안녕하세요',
    description: '메시지',
  })
  readonly message: string;

  @ApiProperty({
    example: 'https://honeymoa.com/blog/2',
    description: '블로그 게시글 URL',
    nullable: true,
  })
  readonly blogUrl: string | null;

  constructor(create: CreateChatMessageResponseDtoProps) {
    super(create);

    const { roomId, senderId, message, blogUrl } = create;

    this.roomId = roomId;
    this.senderId = senderId;
    this.message = message;
    this.blogUrl = blogUrl;
  }
}
