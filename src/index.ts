import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import {
  screenshotToolName,
  screenshotToolDescription,
  ScreenshotToolSchema,
  runScreenshotTool,
} from "./tools/screenshot.js";

import {
  architectToolName,
  architectToolDescription,
  ArchitectToolSchema,
  runArchitectTool,
} from "./tools/architect.js";

import {
  codeReviewToolName,
  codeReviewToolDescription,
  CodeReviewToolSchema,
  runCodeReviewTool,
} from "./tools/codeReview.js";

// Import MongoDB tools
import {
  mongoModelToolName,
  mongoModelToolDescription,
  MongoModelToolSchema,
  runMongoModelTool,
} from "./tools/mongoModel.js";

import {
  mongoThreadToolName,
  mongoThreadToolDescription,
  MongoThreadToolSchema,
  runMongoThreadTool,
} from "./tools/mongoThread.js";

import {
  mongoMessageToolName,
  mongoMessageToolDescription,
  MongoMessageToolSchema,
  runMongoMessageTool,
} from "./tools/mongoMessage.js";

import {
  mongoQueryModelsToolName,
  mongoQueryModelsToolDescription,
  MongoQueryModelsToolSchema,
  runMongoQueryModelsTool,
} from "./tools/mongoQueryModels.js";

import {
  mongoQueryThreadsToolName,
  mongoQueryThreadsToolDescription,
  MongoQueryThreadsToolSchema,
  runMongoQueryThreadsTool,
} from "./tools/mongoQueryThreads.js";

import {
  mongoQueryMessagesToolName,
  mongoQueryMessagesToolDescription,
  MongoQueryMessagesToolSchema,
  runMongoQueryMessagesTool,
} from "./tools/mongoQueryMessages.js";

// Import MongoDB connection
import { connectToDatabase, disconnectFromDatabase } from "./db/connection.js";

/**
 * An MCP server providing tools for:
 *   1) Screenshot
 *   2) Architect
 *   3) CodeReview
 *   4) MongoDB Model Management
 *   5) MongoDB Thread Management
 *   6) MongoDB Message Management
 *   7) MongoDB Model Queries
 *   8) MongoDB Thread Queries
 *   9) MongoDB Message Queries
 */

// 1. Create an MCP server instance
const server = new Server(
  {
    name: "cursor-tools",
    version: "2.0.1",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// 2. Define the list of tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Original tools
      {
        name: screenshotToolName,
        description: screenshotToolDescription,
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "Full URL to screenshot",
            },
            relativePath: {
              type: "string",
              description: "Relative path appended to http://localhost:3000",
            },
            fullPathToScreenshot: {
              type: "string",
              description:
                "Path to where the screenshot file should be saved. This should be a cwd-style full path to the file (not relative to the current working directory) including the file name and extension.",
            },
          },
          required: [],
        },
      },
      {
        name: architectToolName,
        description: architectToolDescription,
        inputSchema: {
          type: "object",
          properties: {
            task: {
              type: "string",
              description: "Description of the task",
            },
            code: {
              type: "string",
              description: "Concatenated code from one or more files",
            },
          },
          required: ["task", "code"],
        },
      },
      {
        name: codeReviewToolName,
        description: codeReviewToolDescription,
        inputSchema: {
          type: "object",
          properties: {
            folderPath: {
              type: "string",
              description:
                "Path to the full root directory of the repository to diff against main",
            },
          },
          required: ["folderPath"],
        },
      },
      // MongoDB Model Tool
      {
        name: mongoModelToolName,
        description: mongoModelToolDescription,
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID of the model to update (optional for creation)",
            },
            name: {
              type: "string",
              description: "Name of the model",
            },
            provider: {
              type: "string",
              description: "Provider of the model (e.g., OpenAI, Anthropic)",
            },
            version: {
              type: "string",
              description: "Version of the model",
            },
            parameters: {
              type: "object",
              properties: {
                temperature: {
                  type: "number",
                  description: "Temperature parameter for the model",
                },
                topP: {
                  type: "number",
                  description: "Top-p parameter for the model",
                },
                maxTokens: {
                  type: "number",
                  description: "Maximum tokens parameter for the model",
                },
                frequencyPenalty: {
                  type: "number",
                  description: "Frequency penalty parameter for the model",
                },
                presencePenalty: {
                  type: "number",
                  description: "Presence penalty parameter for the model",
                },
              },
            },
            capabilities: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of capabilities of the model",
            },
          },
          required: ["name", "provider", "version"],
        },
      },
      // MongoDB Thread Tool
      {
        name: mongoThreadToolName,
        description: mongoThreadToolDescription,
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID of the thread to update (optional for creation)",
            },
            title: {
              type: "string",
              description: "Title of the thread",
            },
            modelId: {
              type: "string",
              description: "ID of the model used for this thread",
            },
            metadata: {
              type: "object",
              properties: {
                userId: {
                  type: "string",
                  description: "ID of the user who created the thread",
                },
                projectId: {
                  type: "string",
                  description: "ID of the project this thread belongs to",
                },
                tags: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "List of tags for the thread",
                },
                context: {
                  type: "string",
                  description: "Context information for the thread",
                },
                safetyScore: {
                  type: "number",
                  description: "Safety score for the thread (0-10)",
                },
              },
              required: ["userId"],
            },
            challenges: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Name of the challenge",
                  },
                  description: {
                    type: "string",
                    description: "Description of the challenge",
                  },
                  category: {
                    type: "string",
                    description: "Category of the challenge (e.g., 'prompt-injection', 'harmful-content')",
                  },
                  severity: {
                    type: "string",
                    enum: ["low", "medium", "high"],
                    description: "Severity level of the challenge",
                  },
                  status: {
                    type: "string",
                    enum: ["identified", "mitigated", "unresolved"],
                    description: "Current status of the challenge",
                  },
                  notes: {
                    type: "string",
                    description: "Additional notes about the challenge",
                  },
                },
                required: ["name", "description", "category", "severity"],
              },
              description: "List of safety challenges identified in this thread",
            },
            status: {
              type: "string",
              enum: ["active", "archived", "flagged"],
              description: "Status of the thread",
            },
          },
          required: ["title", "modelId", "metadata"],
        },
      },
      // MongoDB Message Tool
      {
        name: mongoMessageToolName,
        description: mongoMessageToolDescription,
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID of the message to update (optional for creation)",
            },
            threadId: {
              type: "string",
              description: "ID of the thread this message belongs to",
            },
            role: {
              type: "string",
              enum: ["user", "assistant", "system"],
              description: "Role of the message sender",
            },
            content: {
              type: "string",
              description: "Content of the message",
            },
            metadata: {
              type: "object",
              properties: {
                tokenCount: {
                  type: "number",
                  description: "Total token count for the message",
                },
                promptTokens: {
                  type: "number",
                  description: "Prompt token count for the message",
                },
                completionTokens: {
                  type: "number",
                  description: "Completion token count for the message",
                },
                toolCalls: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description: "Name of the tool called",
                      },
                      arguments: {
                        type: "object",
                        description: "Arguments passed to the tool",
                      },
                      result: {
                        type: "string",
                        description: "Result of the tool call",
                      },
                    },
                  },
                  description: "List of tool calls made in the message",
                },
                safetyFlags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      category: {
                        type: "string",
                        description: "Category of the safety flag",
                      },
                      severity: {
                        type: "string",
                        enum: ["low", "medium", "high"],
                        description: "Severity of the safety flag",
                      },
                      details: {
                        type: "string",
                        description: "Details about the safety flag",
                      },
                    },
                  },
                  description: "List of safety flags for the message",
                },
              },
            },
          },
          required: ["threadId", "role", "content"],
        },
      },
      // MongoDB Query Models Tool
      {
        name: mongoQueryModelsToolName,
        description: mongoQueryModelsToolDescription,
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID of the model to retrieve",
            },
            provider: {
              type: "string",
              description: "Provider to filter models by",
            },
          },
          required: [],
        },
      },
      // MongoDB Query Threads Tool
      {
        name: mongoQueryThreadsToolName,
        description: mongoQueryThreadsToolDescription,
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID of the thread to retrieve",
            },
            userId: {
              type: "string",
              description: "User ID to filter threads by",
            },
            modelId: {
              type: "string",
              description: "Model ID to filter threads by",
            },
            tag: {
              type: "string",
              description: "Tag to filter threads by",
            },
            challengeCategory: {
              type: "string",
              description: "Challenge category to filter threads by (e.g., 'prompt-injection', 'harmful-content')",
            },
            challengeSeverity: {
              type: "string",
              enum: ["low", "medium", "high"],
              description: "Challenge severity level to filter threads by",
            },
            challengeStatus: {
              type: "string",
              enum: ["identified", "mitigated", "unresolved"],
              description: "Challenge status to filter threads by",
            },
            status: {
              type: "string",
              enum: ["active", "archived", "flagged"],
              description: "Status to filter threads by",
            },
          },
          required: [],
        },
      },
      // MongoDB Query Messages Tool
      {
        name: mongoQueryMessagesToolName,
        description: mongoQueryMessagesToolDescription,
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID of the message to retrieve",
            },
            threadId: {
              type: "string",
              description: "Thread ID to filter messages by",
            },
            role: {
              type: "string",
              enum: ["user", "assistant", "system"],
              description: "Role to filter messages by",
            },
            safetyFlagsOnly: {
              type: "boolean",
              description: "Whether to only return messages with safety flags",
            },
          },
          required: [],
        },
      },
    ],
  };
});

// 3. Implement the tool call logic
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    // Original tools
    case screenshotToolName: {
      const validated = ScreenshotToolSchema.parse(args);
      return await runScreenshotTool(validated);
    }
    case architectToolName: {
      const validated = ArchitectToolSchema.parse(args);
      return await runArchitectTool(validated);
    }
    case codeReviewToolName: {
      const validated = CodeReviewToolSchema.parse(args);
      return await runCodeReviewTool(validated);
    }
    // MongoDB tools
    case mongoModelToolName: {
      const validated = MongoModelToolSchema.parse(args);
      return await runMongoModelTool(validated);
    }
    case mongoThreadToolName: {
      const validated = MongoThreadToolSchema.parse(args);
      return await runMongoThreadTool(validated);
    }
    case mongoMessageToolName: {
      const validated = MongoMessageToolSchema.parse(args);
      return await runMongoMessageTool(validated);
    }
    case mongoQueryModelsToolName: {
      const validated = MongoQueryModelsToolSchema.parse(args);
      return await runMongoQueryModelsTool(validated);
    }
    case mongoQueryThreadsToolName: {
      const validated = MongoQueryThreadsToolSchema.parse(args);
      return await runMongoQueryThreadsTool(validated);
    }
    case mongoQueryMessagesToolName: {
      const validated = MongoQueryMessagesToolSchema.parse(args);
      return await runMongoQueryMessagesTool(validated);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// 4. Start the MCP server with a stdio transport
async function main() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Cursor Tools MCP Server running on stdio");
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.error('Shutting down server...');
      await disconnectFromDatabase();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.error('Shutting down server...');
      await disconnectFromDatabase();
      process.exit(0);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
