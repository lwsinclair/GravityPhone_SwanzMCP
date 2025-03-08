import { Model, IModel } from '../models/model.js';

export const modelController = {
  // Create a new model
  async createModel(modelData: Partial<IModel>): Promise<IModel> {
    try {
      const model = new Model(modelData);
      await model.save();
      return model;
    } catch (error) {
      console.error('Error creating model:', error);
      throw error;
    }
  },

  // Get all models
  async getAllModels(): Promise<IModel[]> {
    try {
      return await Model.find().sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting all models:', error);
      throw error;
    }
  },

  // Get model by ID
  async getModelById(id: string): Promise<IModel | null> {
    try {
      return await Model.findById(id);
    } catch (error) {
      console.error('Error getting model by ID:', error);
      throw error;
    }
  },

  // Get models by provider
  async getModelsByProvider(provider: string): Promise<IModel[]> {
    try {
      return await Model.find({ provider }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting models by provider:', error);
      throw error;
    }
  },

  // Update model
  async updateModel(id: string, modelData: Partial<IModel>): Promise<IModel | null> {
    try {
      return await Model.findByIdAndUpdate(id, modelData, { new: true });
    } catch (error) {
      console.error('Error updating model:', error);
      throw error;
    }
  },

  // Delete model
  async deleteModel(id: string): Promise<IModel | null> {
    try {
      return await Model.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting model:', error);
      throw error;
    }
  }
}; 