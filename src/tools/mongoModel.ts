import { z } from "zod";
import { modelController } from "../db/controllers/index.js";
import { IModel } from "../db/models/model.js";

/**
 * MongoDB Model Tool
 * - Creates or updates a model in the MongoDB database
 */

export const mongoModelToolName = "mongo_model";
export const mongoModelToolDescription =
  "Create or update a model in the MongoDB database for LLM conversations.";

export const MongoModelToolSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  provider: z.string(),
  version: z.string(),
  parameters: z.object({
    temperature: z.number().optional(),
    topP: z.number().optional(),
    maxTokens: z.number().optional(),
    frequencyPenalty: z.number().optional(),
    presencePenalty: z.number().optional(),
  }).optional(),
  capabilities: z.array(z.string()).optional(),
});

export async function runMongoModelTool(
  args: z.infer<typeof MongoModelToolSchema>,
) {
  try {
    let result;
    
    // Convert the args to the correct format for the model controller
    const modelData: Partial<IModel> = {
      name: args.name,
      provider: args.provider,
      version: args.version,
      capabilities: args.capabilities,
    };
    
    // Only add parameters if they exist
    if (args.parameters) {
      modelData.parameters = {
        temperature: args.parameters.temperature ?? 0.7,
        topP: args.parameters.topP ?? 1.0,
        maxTokens: args.parameters.maxTokens ?? 4096,
        frequencyPenalty: args.parameters.frequencyPenalty ?? 0,
        presencePenalty: args.parameters.presencePenalty ?? 0,
      };
    }
    
    if (args.id) {
      // Update existing model
      result = await modelController.updateModel(args.id, modelData);
      if (!result) {
        throw new Error(`Model with ID ${args.id} not found`);
      }
    } else {
      // Create new model
      result = await modelController.createModel(modelData);
    }

    return {
      content: [
        {
          type: "text",
          text: `Model ${args.id ? 'updated' : 'created'} successfully: ${JSON.stringify(result, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    console.error("Error in mongo_model tool:", error);
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