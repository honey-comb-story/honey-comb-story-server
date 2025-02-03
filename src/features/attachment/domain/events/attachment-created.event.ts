import { DomainEvent, DomainEventProps } from '@libs/ddd/base-domain.event';

export class AttachmentCreatedDomainEvent extends DomainEvent {
  readonly userId: bigint;
  readonly url: string;
  readonly path: string;
  readonly mimeType: string;
  readonly capacity: bigint;

  constructor(props: DomainEventProps<AttachmentCreatedDomainEvent>) {
    super(props);

    const { userId, url, path, mimeType, capacity } = props;

    this.userId = userId;
    this.url = url;
    this.path = path;
    this.mimeType = mimeType;
    this.capacity = capacity;
  }
}
