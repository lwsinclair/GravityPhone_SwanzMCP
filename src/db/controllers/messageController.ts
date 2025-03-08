import { Message, IMessage } from '../models/message.js';

export const messageController = {
  // Create a new message
  async createMessage(messageData: Partial<IMessage>): Promise<IMessage> {
    try {
      const message = new Message(messageData);
      await message.save();
      return message;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  },

  // Get all messages for a thread
  async getMessagesByThreadId(threadId: string): Promise<IMessage[]> {
    try {
      return await Message.find({ threadId }).sort({ createdAt: 1 });
    } catch (error) {
      console.error('Error getting messages by thread ID:', error);
      throw error;
    }
  },

  // Get message by ID
  async getMessageById(id: string): Promise<IMessage | null> {
    try {
      return await Message.findById(id);
    } catch (error) {
      console.error('Error getting message by ID:', error);
      throw error;
    }
  },

  // Get messages by role
  async getMessagesByRole(threadId: string, role: 'user' | 'assistant' | 'system'): Promise<IMessage[]> {
    try {
      return await Message.find({ threadId, role }).sort({ createdAt: 1 });
    } catch (error) {
      console.error('Error getting messages by role:', error);
      throw error;
    }
  },

  // Get messages with safety flags
  async getMessagesWithSafetyFlags(threadId: string): Promise<IMessage[]> {
    try {
      return await Message.find({
        threadId,
        'metadata.safetyFlags': { $exists: true, $ne: [] }
      }).sort({ createdAt: 1 });
    } catch (error) {
      console.error('Error getting messages with safety flags:', error);
      throw error;
    }
  },

  // Update message
  async updateMessage(id: string, messageData: Partial<IMessage>): Promise<IMessage | null> {
    try {
      return await Message.findByIdAndUpdate(id, messageData, { new: true });
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  },

  // Delete message
  async deleteMessage(id: string): Promise<IMessage | null> {
    try {
      return await Message.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
}; 