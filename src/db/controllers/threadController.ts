import { Thread, IThread } from '../models/thread.js';

export const threadController = {
  // Create a new thread
  async createThread(threadData: Partial<IThread>): Promise<IThread> {
    try {
      const thread = new Thread(threadData);
      await thread.save();
      return thread;
    } catch (error) {
      console.error('Error creating thread:', error);
      throw error;
    }
  },

  // Get all threads
  async getAllThreads(): Promise<IThread[]> {
    try {
      return await Thread.find().sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting all threads:', error);
      throw error;
    }
  },

  // Get thread by ID
  async getThreadById(id: string): Promise<IThread | null> {
    try {
      return await Thread.findById(id).populate('modelId');
    } catch (error) {
      console.error('Error getting thread by ID:', error);
      throw error;
    }
  },

  // Get threads by user ID
  async getThreadsByUserId(userId: string): Promise<IThread[]> {
    try {
      return await Thread.find({ 'metadata.userId': userId }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting threads by user ID:', error);
      throw error;
    }
  },

  // Get threads by model ID
  async getThreadsByModelId(modelId: string): Promise<IThread[]> {
    try {
      return await Thread.find({ modelId }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting threads by model ID:', error);
      throw error;
    }
  },

  // Get threads by tag
  async getThreadsByTag(tag: string): Promise<IThread[]> {
    try {
      return await Thread.find({ 'metadata.tags': tag }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting threads by tag:', error);
      throw error;
    }
  },

  // Get threads by challenge category
  async getThreadsByChallengeCategory(category: string): Promise<IThread[]> {
    try {
      return await Thread.find({ 'challenges.category': category }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting threads by challenge category:', error);
      throw error;
    }
  },

  // Get threads by challenge severity
  async getThreadsByChallengeSeverity(severity: 'low' | 'medium' | 'high'): Promise<IThread[]> {
    try {
      return await Thread.find({ 'challenges.severity': severity }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting threads by challenge severity:', error);
      throw error;
    }
  },

  // Get threads by challenge status
  async getThreadsByChallengeStatus(status: 'identified' | 'mitigated' | 'unresolved'): Promise<IThread[]> {
    try {
      return await Thread.find({ 'challenges.status': status }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting threads by challenge status:', error);
      throw error;
    }
  },

  // Update thread
  async updateThread(id: string, threadData: Partial<IThread>): Promise<IThread | null> {
    try {
      return await Thread.findByIdAndUpdate(id, threadData, { new: true });
    } catch (error) {
      console.error('Error updating thread:', error);
      throw error;
    }
  },

  // Delete thread
  async deleteThread(id: string): Promise<IThread | null> {
    try {
      return await Thread.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting thread:', error);
      throw error;
    }
  }
}; 