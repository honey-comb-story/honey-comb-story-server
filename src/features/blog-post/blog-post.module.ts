import { AttachmentModule } from '@features/attachment/attachment.module';
import { BlogPostAttachmentMapper } from '@features/blog-post/blog-post-attachment/mappers/blog-post-attachment.mapper';
import { BlogPostAttachmentRepository } from '@features/blog-post/blog-post-attachment/repositories/blog-post-attachment.repository';
import { BLOG_POST_ATTACHMENT_REPOSITORY_DI_TOKEN } from '@features/blog-post/blog-post-attachment/tokens/di.token';
import { BlogPostTagMapper } from '@features/blog-post/blog-post-tag/mappers/blog-post-tag.mapper';
import { BlogPostTagRepository } from '@features/blog-post/blog-post-tag/repositories/blog-post-tag.repository';
import { BLOG_POST_TAG_REPOSITORY_DI_TOKEN } from '@features/blog-post/blog-post-tag/tokens/di.token';
import { CreateBlogPostCommandHandler } from '@features/blog-post/commands/create-blog-post/create-blog-post.command-handler';
import { DeleteBlogPostCommandHandler } from '@features/blog-post/commands/delete-blog-post/delete-blog-post.command-handler';
import { PatchUpdateBlogPostCommandHandler } from '@features/blog-post/commands/patch-update-blog-post/patch-update-blog-post.command-handler';
import { BlogPostController } from '@features/blog-post/controllers/blog-post.controller';
import { BlogPostBlogDeletedDomainEventListener } from '@features/blog-post/domain/events/listeners/blog-post-blog-deleted.domain-event-listener';
import { BlogPostMapper } from '@features/blog-post/mappers/blog-post.mapper';
import { FindOneBlogPostQueryHandler } from '@features/blog-post/queries/find-one-blog-post/find-one-blog-post.query-handler';
import { BlogPostRepository } from '@features/blog-post/repositories/blog-post.repository';
import { BLOG_POST_REPOSITORY_DI_TOKEN } from '@features/blog-post/tokens/di.token';
import { BlogModule } from '@features/blog/blog.module';
import { TagModule } from '@features/tag/tag.module';
import { UserModule } from '@features/user/user.module';
import { S3Module } from '@libs/s3/s3.module';
import { Module, Provider } from '@nestjs/common';

const controllers = [BlogPostController];

const mappers: Provider[] = [
  BlogPostMapper,
  BlogPostTagMapper,
  BlogPostAttachmentMapper,
];

const commandHandlers: Provider[] = [
  CreateBlogPostCommandHandler,
  PatchUpdateBlogPostCommandHandler,
  DeleteBlogPostCommandHandler,
];

const queryHandlers: Provider[] = [FindOneBlogPostQueryHandler];

const repositories: Provider[] = [
  { provide: BLOG_POST_REPOSITORY_DI_TOKEN, useClass: BlogPostRepository },
  {
    provide: BLOG_POST_TAG_REPOSITORY_DI_TOKEN,
    useClass: BlogPostTagRepository,
  },
  {
    provide: BLOG_POST_ATTACHMENT_REPOSITORY_DI_TOKEN,
    useClass: BlogPostAttachmentRepository,
  },
];

const domainEventListeners: Provider[] = [
  BlogPostBlogDeletedDomainEventListener,
];

@Module({
  imports: [BlogModule, TagModule, UserModule, AttachmentModule, S3Module],
  controllers: [...controllers],
  providers: [
    ...mappers,
    ...commandHandlers,
    ...queryHandlers,
    ...repositories,
    ...domainEventListeners,
  ],
})
export class BlogPostModule {}
