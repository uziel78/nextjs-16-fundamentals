'use client';

import { Loader2, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentSchema } from '@/app/schemas/comment';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useParams } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import z from 'zod';
import { toast } from 'sonner';
import { useTransition } from 'react';

// This component will be used in the blog post page to display a comment form and a list of comments for the post. For simplicity, this example just shows the form without the actual comment list or submission logic, but you can implement that once you have the data fetching and mutation set up.
export function CommentSection() {
  const [isPending, startTransition] = useTransition();
  const params = useParams<{ postId: Id<'posts'> }>();

  // mutation use in client instead of server action because we want to optimistically update the UI with the new comment without needing to wait for a full page refresh. This allows for a smoother user experience, as the comment can appear immediately in the list of comments while the server processes the request in the background.
  const createComment = useMutation(api.comments.createComment);

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: '',
      postId: params.postId,
    },
  });

  async function onSubmit(data: z.infer<typeof commentSchema>) {
    startTransition(async () => {
      try {
        await createComment(data);
        //form.reset();
        toast.success('Comment posted');
      } catch {
        toast.error('Failed to create post');
      }
    });
  }

  //   if (data === undefined) {
  //     return <p>loading...</p>;
  //   }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center gap-2 border-b'>
        <MessageSquare className='size-5' />
        <h2 className='text-lg font-bold'>5 Comments</h2>
      </CardHeader>
      <CardContent>
        <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name='body'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder='Share your thoughts'
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button className='mt-4' disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className='size-4 animate-spin' />
                <span>Loading...</span>
              </>
            ) : (
              <span>Comment</span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
