import _ from 'lodash';
import { injectable } from 'inversify';
import { Table } from '../schema';
import { BaseRepository } from './baseRepository';

export interface Make {
  id: number;
  name: string;
}

@injectable()
export class MakeRepository extends BaseRepository {
  async getMake(id?: number): Promise<Make | null> {
    if (!id || id <= 0) {
      return null;
    }
    const [make] = await this.get<Make>(Table.Makes, '*', (query) => query.where('id', id));
    return make || null;
  }

  async getAllMakes(): Promise<Make[]> {
    return this.get<Make>(Table.Makes, '*');
  }

  async getMakeByName(name: string): Promise<Make | null> {
    const [make] = await this.get<Make>(Table.Makes, '*', (query) => query.where('name', name));
    return make || null;
  }

  async createMake(data: Partial<Make>): Promise<Make> {
    const [inserted] = await this.insert<Make>(Table.Makes, [data]);
    return inserted;
  }

  async updateMake(data: Partial<Make>): Promise<Make | null> {
    if (!data.id) {
      throw new Error('ID is required for update');
    }

    const { id, ...updateFields } = data;
    
    // First, get the existing make to merge with updates
    const existing = await this.getMake(id);
    if (!existing) {
      return null;
    }

    // Merge existing data with updates to ensure all required fields are present
    const completeData = {
      ...existing,
      ...updateFields,
      id
    };
    
    const [updated] = await this.upsert<Make>(Table.Makes, [completeData]);
    
    return updated || null;
  }

  async deleteMake(id: number): Promise<boolean> {
    const deleted = await this.hardDelete(Table.Makes, (query) => query.where('id', id));
    return deleted;
  }
}