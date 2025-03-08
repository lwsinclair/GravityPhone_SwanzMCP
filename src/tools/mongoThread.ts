import { z } from "zod";
import { threadController } from "../db/controllers/index.js";
import { IThread } from "../db/models/thread.js";

/**
 * MongoDB Thread Tool
 * - Creates or updates a thread in the MongoDB database
 */

export const mongoThreadToolName = "mongo_thread";
export const mongoThreadToolDescription =
  "Create or update a thread in the MongoDB database for LLM conversations.";

export const MongoThreadToolSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  modelId: z.string(),
  metadata: z.object({
    userId: z.string(),
    projectId: z.string().optional(),
    tags: z.array(z.string()).optional(),
    context: z.string().optional(),
    safetyScore: z.number().min(0).max(10).optional(),
  }),
  challenges: z.array(z.object({
    name: z.string(),
    description: z.string(),
    category: z.string(),
    severity: z.enum(['low', 'medium', 'high']),
    status: z.enum(['identified', 'mitigated', 'unresolved']).default('identified'),
    notes: z.string().optional(),
  })).optional(),
  status: z.enum(['active', 'archived', 'flagged']).optional(),
});

export async function runMongoThreadTool(
  args: z.infer<typeof MongoThreadToolSchema>,
) {
  try {
    let result;
    
    // Convert the args to the correct format for the thread controller
    const threadData: Partial<IThread> = {
      title: args.title,
      modelId: args.modelId as any, // Cast to any to avoid type issues with ObjectId
      metadata: {
        userId: args.metadata.userId,
        projectId: args.metadata.projectId,
        tags: args.metadata.tags || [],
        context: args.metadata.context,
        safetyScore: args.metadata.safetyScore,
      },
      status: args.status || 'active',
    };
    
    // Only add challenges if they exist
    if (args.challenges && args.challenges.length > 0) {
      threadData.challenges = args.challenges.map(challenge => ({
        ...challenge,
        status: challenge.status || 'identified'
      }));
    }
    
    if (args.id) {
      // Update existing thread
      result = await threadController.updateThread(args.id, threadData);
      if (!result) {
        throw new Error(`Thread with ID ${args.id} not found`);
      }
    } else {
      // Create new thread
      result = await threadController.createThread(threadData);
    }

    return {
      content: [
        {
          type: "text",
          text: `Thread ${args.id ? 'updated' : 'created'} successfully: ${JSON.stringify(result, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    console.error("Error in mongo_thread tool:", error);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
} 