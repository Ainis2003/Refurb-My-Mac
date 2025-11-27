import _ from 'lodash';
import { injectable } from 'inversify';
import { Table } from '../schema';
import { BaseRepository } from './baseRepository';

export interface Model {
  id: number;
  make_id: number;
  name: string;
}

@injectable()
export class ModelRepository extends BaseRepository {
  async getModel(id?: number): Promise<Model | null> {
    if (!id || id <= 0) {
      return null;
    }
    const [model] = await this.get<Model>(Table.Models, '*', (query) => query.where('id', id));
    return model || null;
  }

  async getAllModels(): Promise<Model[]> {
    return this.get<Model>(Table.Models, '*');
  }

  async getModelsByMakeId(makeId: number): Promise<Model[]> {
    return this.get<Model>(Table.Models, '*', (query) => query.where('make_id', makeId));
  }

  async getModelByNameAndMakeId(name: string, makeId: number): Promise<Model | null> {
    const [model] = await this.get<Model>(Table.Models, '*', (query) => 
      query.where('name', name).andWhere('make_id', makeId)
    );
    return model || null;
  }

  async createModel(data: Partial<Model>): Promise<Model> {
    const [inserted] = await this.insert<Model>(Table.Models, [data]);
    return inserted;
  }

  async updateModel(data: Partial<Model>): Promise<Model | null> {
    if (!data.id) {
      throw new Error('ID is required for update');
    }

    const { id, ...updateFields } = data;
    
    // First, get the existing model to merge with updates
    const existing = await this.getModel(id);
    if (!existing) {
      return null;
    }

    // Merge existing data with updates to ensure all required fields are present
    const completeData = {
      ...existing,
      ...updateFields,
      id
    };
    
    const [updated] = await this.upsert<Model>(Table.Models, [completeData]);
    
    return updated || null;
  }

  async deleteModel(id: number): Promise<boolean> {
    const deleted = await this.hardDelete(Table.Models, (query) => query.where('id', id));
    return deleted;
  }
}