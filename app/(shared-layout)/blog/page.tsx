'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

export default function BlogPage() {
  const data = useQuery(api.posts.getPosts);

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
          <Card key={post._id}>
            <div>
              <Image
                src='https://images.unsplash.com/photo-1771506364945-0b6566c6cd5f?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                width={500}
                height={800}
                alt='image'
              />
            </div>
            <h2 className='text-2xl font-bold'>{post.title}</h2>
          </Card>
        ))}
      </div>
    </div>
  );
}
