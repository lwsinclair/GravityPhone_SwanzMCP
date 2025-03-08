import { z } from "zod";
import { messageController } from "../db/controllers/index.js";

/**
 * MongoDB Query Messages Tool
 * - Retrieves messages from the MongoDB database
 */

export const mongoQueryMessagesToolName = "mongo_query_messages";
export const mongoQueryMessagesToolDescription =
  "Query messages from the MongoDB database for LLM conversations.";

export const MongoQueryMessagesToolSchema = z.object({
  id: z.string().optional(),
  threadId: z.string().optional(),
  role: z.enum(['user', 'assistant', 'system']).optional(),
  safetyFlagsOnly: z.boolean().optional(),
});

export async function runMongoQueryMessagesTool(
  args: z.infer<typeof MongoQueryMessagesToolSchema>,
) {
  try {
    let result;
    
    if (args.id) {
      // Get message by ID
      result = await messageController.getMessageById(args.id);
      if (!result) {
        return {
          content: [
            {
              type: "text",
              text: `No message found with ID: ${args.id}`,
            },
          ],
        };
      }
    } else if (args.threadId) {
      if (args.safetyFlagsOnly) {
        // Get messages with safety flags
        result = await messageController.getMessagesWithSafetyFlags(args.threadId);
      } else if (args.role) {
        // Get messages by role
        result = await messageController.getMessagesByRole(args.threadId, args.role);
      } else {
        // Get all messages for thread
        result = await messageController.getMessagesByThreadId(args.threadId);
      }
    } else {
      return {
        content: [
          {
            type: "text",
            text: "Error: Either id or threadId must be provided",
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Messages retrieved successfully: ${JSON.stringify(result, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    console.error("Error in mongo_query_messages tool:", error);
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