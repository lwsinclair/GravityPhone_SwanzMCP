import { z } from "zod";
import { messageController } from "../db/controllers/index.js";
import { IMessage } from "../db/models/message.js";

/**
 * MongoDB Message Tool
 * - Creates or updates a message in the MongoDB database
 */

export const mongoMessageToolName = "mongo_message";
export const mongoMessageToolDescription =
  "Create or update a message in the MongoDB database for LLM conversations.";

export const MongoMessageToolSchema = z.object({
  id: z.string().optional(),
  threadId: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  metadata: z.object({
    tokenCount: z.number().optional(),
    promptTokens: z.number().optional(),
    completionTokens: z.number().optional(),
    toolCalls: z.array(z.object({
      name: z.string(),
      arguments: z.record(z.any()),
      result: z.string().optional(),
    })).optional(),
    safetyFlags: z.array(z.object({
      category: z.string(),
      severity: z.enum(['low', 'medium', 'high']),
      details: z.string().optional(),
    })).optional(),
  }).optional(),
});

export async function runMongoMessageTool(
  args: z.infer<typeof MongoMessageToolSchema>,
) {
  try {
    let result;
    
    // Convert the args to the correct format for the message controller
    const messageData: Partial<IMessage> = {
      threadId: args.threadId as any, // Cast to any to avoid type issues with ObjectId
      role: args.role,
      content: args.content,
      metadata: args.metadata || {},
    };
    
    if (args.id) {
      // Update existing message
      result = await messageController.updateMessage(args.id, messageData);
      if (!result) {
        throw new Error(`Message with ID ${args.id} not found`);
      }
    } else {
      // Create new message
      result = await messageController.createMessage(messageData);
    }

    return {
      content: [
        {
          type: "text",
          text: `Message ${args.id ? 'updated' : 'created'} successfully: ${JSON.stringify(result, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    console.error("Error in mongo_message tool:", error);
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