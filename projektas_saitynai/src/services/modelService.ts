import _ from 'lodash';
import { inject, injectable } from 'inversify';
import { ModelRepository, Model } from '../repositories/modelRepository';
import { MakeRepository } from '../repositories/makeRepository';
import { TYPES } from '../ioc/types';

@injectable()
export class ModelService {
  constructor(
    @inject(TYPES.modelRepository) private modelRepository: ModelRepository,
    @inject(TYPES.makeRepository) private makeRepository: MakeRepository
  ) {}

  async getModel(id: number): Promise<Model | null> {
    return this.modelRepository.getModel(id);
  }

  async getAllModels(): Promise<Model[]> {
    return this.modelRepository.getAllModels();
  }

  async getModelsByMakeId(makeId: number): Promise<Model[]> {
    const make = await this.makeRepository.getMake(makeId);
    if (!make) {
      throw new Error(`Make with ID ${makeId} not found.`);
    }
    return this.modelRepository.getModelsByMakeId(makeId);
  }

  async createModel(data: Partial<Model>): Promise<Model> {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Missing required field: name');
    }

    if (!data.make_id) {
      throw new Error('Missing required field: make_id');
    }

    const make = await this.makeRepository.getMake(data.make_id);
    if (!make) {
      throw new Error(`Make with ID ${data.make_id} not found.`);
    }

    const existing = await this.modelRepository.getModelByNameAndMakeId(data.name, data.make_id);
    if (existing) {
      throw new Error(`Model with name "${data.name}" already exists for this make.`);
    }

    const { id, ...safeData } = data;
    return this.modelRepository.createModel(safeData);
  }

  async updateModel(id: number, data: Partial<Model>): Promise<Model | null> {
    const existing = await this.modelRepository.getModel(id);
    if (!existing) {
      throw new Error(`Model with ID ${id} not found.`);
    }

    if (data.make_id && data.make_id !== existing.make_id) {
      const make = await this.makeRepository.getMake(data.make_id);
      if (!make) {
        throw new Error(`Make with ID ${data.make_id} not found.`);
      }
    }

    const nameToCheck = data.name || existing.name;
    const makeIdToCheck = data.make_id || existing.make_id;

    if (data.name || data.make_id) {
      const duplicate = await this.modelRepository.getModelByNameAndMakeId(nameToCheck, makeIdToCheck);
      if (duplicate && duplicate.id !== id) {
        throw new Error(`Model with name "${nameToCheck}" already exists for this make.`);
      }
    }

    return this.modelRepository.updateModel({ ...data, id });
  }

  async deleteModel(id: number): Promise<any> {
    const existing = await this.modelRepository.getModel(id);
    if (!existing) {
      throw new Error(`Model with ID ${id} not found.`);
    }
    return this.modelRepository.deleteModel(id);
  }
}