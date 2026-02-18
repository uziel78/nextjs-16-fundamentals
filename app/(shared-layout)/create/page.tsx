'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { postSchema } from '@/app/schemas/blog';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function CreateRoute() {
  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  return (
    <div className='py-12'>
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-extra-bold tracking-tight sm:text-5xl'>
          Create Post
        </h1>
        <p className='text-xl text-muted-foreground pt-4'>
          Share your thoughts with the world
        </p>
      </div>

      <Card className='w-full max-w-xl mx-auto'>
        <CardHeader>
          <CardTitle>Create Blog Article</CardTitle>
          <CardDescription>Create a new blog article.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Controller
                name='title'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder='super exciting title'
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name='content'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Content</FieldLabel>
                    <Textarea
                      aria-invalid={fieldState.invalid}
                      placeholder='super cool blog content'
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
