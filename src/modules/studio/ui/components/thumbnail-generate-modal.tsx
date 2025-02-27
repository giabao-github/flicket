"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResponsiveModal } from "@/components/reponsive-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";


interface ThumbnailGenerateModalProps {
  videoId: string;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

const formSchema = z.object({
  prompt: z.string().min(10),
})

export const ThumbnailGenerateModal = ({ videoId, open, onOpenChangeAction }: ThumbnailGenerateModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ''
    }
  });

  const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
    onSuccess: () => {
      toast.success('Thumbnail generation has started', { description: 'This could take a while' });
    },
    onError: (error) => {
      toast.error('Failed to generate your thumbnail', { description: 'Please refresh the page and try again' });
      console.log('Error generating thumbnail:', error.message);
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    generateThumbnail.mutate({
      prompt: values.prompt,
      id: videoId
    })
  }

  return (
    <ResponsiveModal
      title='Generate a thumbnail'
      open={open}
      onOpenChange={onOpenChangeAction}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-4'
        >
          <FormField
            control={form.control}
            name='prompt'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className='resize-none placeholder:text-text-foreground'
                    cols={30}
                    rows={5}
                    placeholder='A description for the generated thumbnail'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-end'>
            <Button
              type='submit'
              variant='basic'
              disabled={generateThumbnail.isPending}
            >
              Generate
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
}