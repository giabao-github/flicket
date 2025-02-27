import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { db } from "@/db";
import { videos, videoUpdateSchema } from "@/db/schema";
import { mux } from "@/lib/mux";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { workflow } from "@/lib/workflow";


export const videosRouter = createTRPCRouter({
  create: protectedProcedure
    .mutation(async ({ ctx }) => {
      const { id: userId } = ctx.user;

      const upload = await mux.video.uploads.create({
        new_asset_settings: {
          passthrough: userId,
          playback_policy: ['public'],
          input: [
            {
              generated_subtitles: [
                {
                  language_code: 'en',
                  name: 'English'
                }
              ]
            }
          ]
          // mp4_support: 'standard' 
        },
        cors_origin: '*'   // In production, set to the web url
      });

      const [video] = await db
        .insert(videos)
        .values({
          userId,
          title: 'Untitled',
          muxStatus: 'waiting',
          muxUploadId: upload.id, 
        })
        .returning();

      return {
        video: video,
        url: upload.url,
      };
    }),
  update: protectedProcedure
    .input(videoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      if (!input.id) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      const [updatedVideo] = await db
        .update(videos)
        .set({
          title: input.title,
          description: input.description,
          categoryId: input.categoryId,
          visibility: input.visibility,
          updatedAt: new Date()
        })
        .where(and(
          eq(videos.id, input.id),
          eq(videos.userId, userId)
        ))
        .returning()

      if (!updatedVideo) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return updatedVideo;
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const [removedVideo] = await db
        .delete(videos)
        .where(and(
          eq(videos.id, input.id),
          eq(videos.userId, userId)
        ))
        .returning();

      if (!removedVideo) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return removedVideo;
    }),
  restoreThumbnail: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(and(
          eq(videos.id, input.id),
          eq(videos.userId, userId)
        ));

      if (!existingVideo) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (existingVideo.thumbnailKey) {
        const api = new UTApi();

        await api.deleteFiles(existingVideo.thumbnailKey);

        await db
          .update(videos)
          .set({
            thumbnailKey: null,
            thumbnailUrl: null
          })
          .where(and(
            eq(videos.id, input.id),
            eq(videos.userId, userId),
          ));
      }

      if (!existingVideo.muxPlaybackId) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      const api = new UTApi();

      const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`;
      const uploadedThumbnail = await api.uploadFilesFromUrl(tempThumbnailUrl);

      if (!uploadedThumbnail.data) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }

      const { key: thumbnailKey, ufsUrl: thumbnailUrl } = uploadedThumbnail.data;

      const [updatedVideo] = await db
        .update(videos)
        .set({
          thumbnailUrl,
          thumbnailKey,
        })
        .where(and(
          eq(videos.id, input.id),
          eq(videos.userId, userId)
        ))
        .returning();

      return updatedVideo;
    }),
  generateThumbnail: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      prompt: z.string().min(10)
    }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/thumbnail`,
        body: { userId, videoId: input.id, prompt: input.prompt },
        retries: 3
      });

      return workflowRunId;
    }),
    generateTitle: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
        body: { userId, videoId: input.id },
        retries: 3
      });

      return workflowRunId;
    }),
    generateDescription: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/description`,
        body: { userId, videoId: input.id },
        retries: 3
      });

      return workflowRunId;
    })
});