import { z } from "zod";
import { threadController } from "../db/controllers/index.js";

/**
 * MongoDB Query Threads Tool
 * - Retrieves threads from the MongoDB database
 */

export const mongoQueryThreadsToolName = "mongo_query_threads";
export const mongoQueryThreadsToolDescription =
  "Query threads from the MongoDB database for LLM conversations.";

export const MongoQueryThreadsToolSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  modelId: z.string().optional(),
  tag: z.string().optional(),
  challengeCategory: z.string().optional(),
  challengeSeverity: z.enum(['low', 'medium', 'high']).optional(),
  challengeStatus: z.enum(['identified', 'mitigated', 'unresolved']).optional(),
  status: z.enum(['active', 'archived', 'flagged']).optional(),
});

export async function runMongoQueryThreadsTool(
  args: z.infer<typeof MongoQueryThreadsToolSchema>,
) {
  try {
    let result;
    
    if (args.id) {
      // Get thread by ID
      result = await threadController.getThreadById(args.id);
      if (!result) {
        return {
          content: [
            {
              type: "text",
              text: `No thread found with ID: ${args.id}`,
            },
          ],
        };
      }
    } else if (args.userId) {
      // Get threads by user ID
      result = await threadController.getThreadsByUserId(args.userId);
    } else if (args.modelId) {
      // Get threads by model ID
      result = await threadController.getThreadsByModelId(args.modelId);
    } else if (args.tag) {
      // Get threads by tag
      result = await threadController.getThreadsByTag(args.tag);
    } else if (args.challengeCategory) {
      // Get threads by challenge category
      result = await threadController.getThreadsByChallengeCategory(args.challengeCategory);
    } else if (args.challengeSeverity) {
      // Get threads by challenge severity
      result = await threadController.getThreadsByChallengeSeverity(args.challengeSeverity);
    } else if (args.challengeStatus) {
      // Get threads by challenge status
      result = await threadController.getThreadsByChallengeStatus(args.challengeStatus);
    } else {
      // Get all threads
      result = await threadController.getAllThreads();
    }

    return {
      content: [
        {
          type: "text",
          text: `Threads retrieved successfully: ${JSON.stringify(result, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    console.error("Error in mongo_query_threads tool:", error);
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