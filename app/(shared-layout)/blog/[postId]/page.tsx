import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchQuery, preloadQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Separator } from '@/components/ui/separator';
import { CommentSection } from '@/components/web/CommentSection';
import { Metadata } from 'next';
import { PostPresence } from '@/components/web/PostPresence';
import { getToken } from '@/lib/auth-server';
import { redirect } from 'next/navigation';

// This file is the page for the route /blog/[postId], which shows a single blog post. It uses the postId from the URL to fetch the post data from the database and display it. For simplicity, this example just shows a placeholder image and a back button, but you can replace that with the actual post content and image once you have the data fetching set up.
interface PostIdRouteProps {
  params: Promise<{
    postId: Id<'posts'>;
  }>;
}

// The generateMetadata function is used to dynamically generate the metadata for the page based on the post data. It fetches the post data using the postId from the URL and returns a metadata object with the post title and description. If the post is not found, it returns a default metadata object indicating that the post was not found.
export async function generateMetadata({
  params,
}: PostIdRouteProps): Promise<Metadata> {
  const { postId } = await params;

  const post = await fetchQuery(api.posts.getPostById, { postId: postId });

  if (!post) {
    return {
      title: 'Post not found',
      description: 'The post you are looking for does not exist.',
    };
  }
  return {
    title: post.title,
    description: post.body,
    category: 'Web Development',
    authors: [{ name: 'RH' }],
  };
}

// This page will be rendered on the server, so we can use async/await to fetch the post data before rendering the page. You can use the postId from the URL to query your database and get the post content and image URL, then pass that data to the component to render it.
export default async function PostIdRoute({ params }: PostIdRouteProps) {
  const { postId } = await params;

  const token = await getToken();

  // We use Promise.all to fetch the post data, pre-load the comments for the post, and get the user ID of the currently authenticated user in parallel. This way, we can optimize the loading time of the page by fetching all the necessary data at once.
  const [post, preLoadedComments, userId] = await Promise.all([
    await fetchQuery(api.posts.getPostById, { postId }),
    await preloadQuery(api.comments.getCommentsByPostId, { postId: postId }),
    await fetchQuery(api.presence.getUserId, {}, { token }),
  ]);

  // If there is no user ID (i.e., the user is not authenticated), we redirect them to the login page. This ensures that only authenticated users can access the post details page. If the user is authenticated but the post is not found, we display a message indicating that no post was found.
  if (!userId) {
    return redirect('/auth/login');
  }

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

        <div className='flex items-center gap-2'>
          <p className='text-muted-foreground text-sm'>
            Posted on:{' '}
            {new Date(post._creationTime).toLocaleDateString('en-NO')}{' '}
          </p>
          {userId && <PostPresence roomId={postId} userId={userId} />}
        </div>
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
