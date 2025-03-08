import { z } from "zod";
import { modelController } from "../db/controllers/index.js";

/**
 * MongoDB Query Models Tool
 * - Retrieves models from the MongoDB database
 */

export const mongoQueryModelsToolName = "mongo_query_models";
export const mongoQueryModelsToolDescription =
  "Query models from the MongoDB database for LLM conversations.";

export const MongoQueryModelsToolSchema = z.object({
  id: z.string().optional(),
  provider: z.string().optional(),
});

export async function runMongoQueryModelsTool(
  args: z.infer<typeof MongoQueryModelsToolSchema>,
) {
  try {
    let result;
    
    if (args.id) {
      // Get model by ID
      result = await modelController.getModelById(args.id);
      if (!result) {
        return {
          content: [
            {
              type: "text",
              text: `No model found with ID: ${args.id}`,
            },
          ],
        };
      }
    } else if (args.provider) {
      // Get models by provider
      result = await modelController.getModelsByProvider(args.provider);
    } else {
      // Get all models
      result = await modelController.getAllModels();
    }

    return {
      content: [
        {
          type: "text",
          text: `Models retrieved successfully: ${JSON.stringify(result, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    console.error("Error in mongo_query_models tool:", error);
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