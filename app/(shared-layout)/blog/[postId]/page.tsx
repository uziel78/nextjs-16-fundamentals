import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchQuery, preloadQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Separator } from '@/components/ui/separator';
import { CommentSection } from '@/components/web/CommentSection';

// This file is the page for the route /blog/[postId], which shows a single blog post. It uses the postId from the URL to fetch the post data from the database and display it. For simplicity, this example just shows a placeholder image and a back button, but you can replace that with the actual post content and image once you have the data fetching set up.
interface PostIdRouteProps {
  params: Promise<{
    postId: Id<'posts'>;
  }>;
}

// This page will be rendered on the server, so we can use async/await to fetch the post data before rendering the page. You can use the postId from the URL to query your database and get the post content and image URL, then pass that data to the component to render it.
export default async function PostIdRoute({ params }: PostIdRouteProps) {
  const { postId } = await params;

  const post = await fetchQuery(api.posts.getPostById, { postId });
  const preLoadedComments = await preloadQuery(
    api.comments.getCommentsByPostId,
    { postId: postId },
  );

  if (!post) {
    return (
      <div>
        <h1 className='text-6xl font-extrabold text-red-500 py-20'>
          No post found
        </h1>
      </div>
    );
  }

  return (
    <div className='max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative'>
      <Link
        className={buttonVariants({ variant: 'outline', className: 'mb-4' })}
        href='/blog'
      >
        <ArrowLeft className='size-4' />
        Back to Blog
      </Link>

      <div className='relative w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-sm'>
        <Image
          src={
            post.imageUrl ??
            'https://images.unsplash.com/photo-1771506364945-0b6566c6cd5f?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
          alt={post.title}
          fill
          className='object-cover hover:scale-105 transition-transform duration-500'
        />
      </div>

      <div className='space-y-4 flex flex-col'>
        <h1 className='text-4xl font-bold tracking-tight text-foreground'>
          {post.title}
        </h1>

        <p className='text-muted-foreground text-sm'>
          Posted on:{' '}
          {new Date(post._creationTime).toLocaleDateString('en-NO')}{' '}
        </p>
      </div>

      <Separator className='my-8' />

      <p className='text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap'>
        {post.body}
      </p>

      <Separator className='my-8' />

      <CommentSection preloadedComments={preLoadedComments} />
    </div>
  );
}
