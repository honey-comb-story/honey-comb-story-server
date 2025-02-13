import { getTsid } from 'tsid-ts';

import { Guard } from '@libs/guard';
import { HttpInternalServerErrorException } from '@libs/exceptions/server-errors/exceptions/http-internal-server-error.exception';
import { COMMON_ERROR_CODE } from '@libs/exceptions/types/errors/common/common-error-code.constant';
import { AggregateRoot } from '@libs/ddd/aggregate-root.base';
import {
  BlogPostAttachmentProps,
  CreateBlogPostAttachmentProps,
} from '@features/blog-post/blog-post-attachment/domain/blog-post-attachment.entity-interface';
import { AggregateID } from '@libs/ddd/entity.base';

export class BlogPostAttachmentEntity extends AggregateRoot<BlogPostAttachmentProps> {
  static readonly BLOG_POST_ATTACHMENT_PATH_PREFIX: string = 'blog-post/';

  static create(
    create: CreateBlogPostAttachmentProps,
  ): BlogPostAttachmentEntity {
    const id = getTsid().toBigInt();

    const now = new Date();

    const props: BlogPostAttachmentProps = {
      ...create,
    };

    const blogPostAttachment = new BlogPostAttachmentEntity({
      id,
      props,
      createdAt: now,
      updatedAt: now,
    });

    return blogPostAttachment;
  }

  get attachmentId(): AggregateID {
    return this.props.attachmentId;
  }

  public validate(): void {
    if (
      !Guard.isPositiveBigInt(this.props.blogPostId) ||
      !Guard.isPositiveBigInt(this.props.attachmentId)
    ) {
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: 'blogPostId 혹은 attachmentId가 PositiveInt가 아님',
      });
    }
  }
}
