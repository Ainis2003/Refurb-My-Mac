import _ from 'lodash';
import { inject, injectable } from 'inversify';
import { MakeRepository, Make } from '../repositories/makeRepository';
import { TYPES } from '../ioc/types';

@injectable()
export class MakeService {
  constructor(@inject(TYPES.makeRepository) private makeRepository: MakeRepository) {}

  async getMake(id: number): Promise<Make | null> {
    return this.makeRepository.getMake(id);
  }

  async getAllMakes(): Promise<Make[]> {
    return this.makeRepository.getAllMakes();
  }

  async createMake(data: Partial<Make>): Promise<Make> {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Missing required field: name');
    }

    const existing = await this.makeRepository.getMakeByName(data.name);
    if (existing) {
      throw new Error(`Make with name "${data.name}" already exists.`);
    }

    const { id, ...safeData } = data;
    return this.makeRepository.createMake(safeData);
  }

  async updateMake(id: number, data: Partial<Make>): Promise<Make | null> {
    const existing = await this.makeRepository.getMake(id);
    if (!existing) {
      throw new Error(`Make with ID ${id} not found.`);
    }

    if (data.name && data.name !== existing.name) {
      const duplicate = await this.makeRepository.getMakeByName(data.name);
      if (duplicate) {
        throw new Error(`Make with name "${data.name}" already exists.`);
      }
    }

    return this.makeRepository.updateMake({ ...data, id });
  }

  async deleteMake(id: number): Promise<any> {
    const existing = await this.makeRepository.getMake(id);
    if (!existing) {
      throw new Error(`Make with ID ${id} not found.`);
    }
    return this.makeRepository.deleteMake(id);
  }
}