import { api } from '@/convex/_generated/api';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { fetchQuery } from 'convex/nextjs';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
//import { connection } from 'next/server';

// force-static ensures that the page is statically generated at build time, and revalidate allows us to specify how often the page should be re-generated. In this case, we set it to 30 seconds, which means that the page will be re-generated at most once every 30 seconds when a request comes in.
// export const dynamic = 'force-static';
// export const revalidate = 30; // Revalidate the page every 30 seconds

export const metadata: Metadata = {
  title: 'Convex & Next.js 16 Fundamentals - Blog',
  description:
    'Read our latests articles and insights about Convex and Next.js 16',
  category: 'Web Development',
  authors: [{ name: 'RH' }],
};

//export default function Layout() {}

// This is the main blog page that lists all the blog posts. It uses Suspense to show a loading state while the data is being fetched.
export default function BlogPage() {
  return (
    <div className='py-12'>
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-extra-bold tracking-tight sm:text-5xl'>
          Our Blog
        </h1>
        <p className='text-xl text-muted-foreground max-w-2xl pt-4 mx-auto'>
          Insights, thoughts and trends from our team!
        </p>
      </div>
      <Suspense fallback={<SkeletonLoadingUI />}>
        <LoadBlogList />
      </Suspense>
    </div>
  );
}

// This component fetches the list of blog posts and renders them. It is wrapped in a Suspense component to show a loading state while the data is being fetched.
async function LoadBlogList() {
  // option for real-time data fetching:
  // We call connection() to ensure that the database connection is established before we try to fetch any data. This is important because if the connection is not established, the fetchQuery calls will fail. By calling connection() at the beginning of the function, we can ensure that the database connection is ready before we attempt to fetch any data.

  // temporeary needed for initial deployment
  //await connection();

  // option for caching data every hour:
  'use cache';
  cacheLife('hours'); // Cache the result of this function for 30 seconds
  cacheTag('blog'); // Tag the cache with 'blog' so that we can invalidate it when a new post is created

  //await connection();
  const data = await fetchQuery(api.posts.getPosts);

  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {data?.map((post) => (
        <Card key={post._id} className='pt-0'>
          <div className='relative h-48 w-full overflow-hidden'>
            <Image
              src={
                post.imageUrl ??
                'https://images.unsplash.com/photo-1771506364945-0b6566c6cd5f?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              }
              alt='image'
              fill
              className='rounded-t-lg object-cover'
            />
          </div>
          <CardContent>
            <Link href={'/blog/${post._id}'}>
              <h1 className='text-2xl font-bold hover:text-primary'>
                {post.title}
              </h1>
            </Link>
            <p className='text-muted-foreground line-clamp-3'>{post.body}</p>
          </CardContent>
          <CardFooter>
            <Link
              className={buttonVariants({ className: 'w-full' })}
              href={`/blog/${post._id}`}
            >
              Read more
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

// This is a simple skeleton loading UI that mimics the structure of the blog list while the data is being fetched. You can customize it to better fit your design.
function SkeletonLoadingUI() {
  return (
    <div className='grid gap-6 md:grid-cols-3 lg:grid-cols-3'>
      {[...Array(3)].map((_, i) => (
        <div key={i} className='flex flex-col space-y-3'>
          <Skeleton className='h-48 w-full rounded-xl' />
          <div className='space-y-2 flex flex-col'>
            <Skeleton className='h-6 w-3/4' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3' />
          </div>
        </div>
      ))}
    </div>
  );
}
