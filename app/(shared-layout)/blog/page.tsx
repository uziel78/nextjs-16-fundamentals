import { api } from '@/convex/_generated/api';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { fetchQuery } from 'convex/nextjs';

// This is a Server Component that fetches data from the Convex backend and renders it on the server.
// No automatic convex data updates will occur in this component (using fetchQuery), but it can fetch data directly from the database without needing to define an API route.
export default async function BlogPage() {
  const data = await fetchQuery(api.posts.getPosts);

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

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {data?.map((post) => (
          <Card key={post._id} className='pt-0'>
            <div className='relative h-48 w-full overflow-hidden'>
              <Image
                src='https://images.unsplash.com/photo-1771506364945-0b6566c6cd5f?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                alt='image'
                fill
                className='rounded-t-lg'
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
                href={'/blog/${post._id}'}
              >
                Read more
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
