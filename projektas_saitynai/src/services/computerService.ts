import _ from 'lodash';
import { inject, injectable } from 'inversify';
import { ComputerRepository, Computer } from '../repositories/computerRepository';
import { ModelRepository } from '../repositories/modelRepository';
import { TYPES } from '../ioc/types';

@injectable()
export class ComputerService {
  constructor(
    @inject(TYPES.computerRepository) private computerRepository: ComputerRepository,
    @inject(TYPES.modelRepository) private modelRepository: ModelRepository
  ) {}

  async getComputer(id: number): Promise<Computer | null> {
    return this.computerRepository.getComputer(id);
  }

  async getAllComputers(): Promise<Computer[]> {
    return this.computerRepository.getAllComputers();
  }

  async createComputer(data: Partial<Computer>): Promise<Computer> {
    // Validate required fields based on DB schema
    if (!data.model_id) {
      throw new Error('Missing required field: model_id');
    }
    if (!data.purchase_price) {
      throw new Error('Missing required field: purchase_price');
    }
    if (!data.purchase_date) {
      throw new Error('Missing required field: purchase_date');
    }
    if (!data.status) {
      throw new Error('Missing required field: status');
    }

    // Verify model exists
    const model = await this.modelRepository.getModel(data.model_id);
    if (!model) {
      throw new Error(`Model with ID ${data.model_id} not found.`);
    }

    // Check for duplicate QR code if provided
    if (data.qr_code) {
      const existing = await this.computerRepository.getComputerByQrCode(data.qr_code);
      if (existing) {
        throw new Error(`Computer with QR code "${data.qr_code}" already exists.`);
      }
    }

    // Hardcode RAM and SSD to default values
    const computerData = {
      ...data,
      ram_option_id: data.ram_option_id || 2, // Default to 16 GB (id: 2)
      ssd_option_id: data.ssd_option_id || 2  // Default to 512 GB (id: 2)
    };

    const { id, ...safeData } = computerData;
    return this.computerRepository.createComputer(safeData);
  }

  async updateComputer(id: number, data: Partial<Computer>): Promise<Computer | null> {
    const existing = await this.computerRepository.getComputer(id);
    if (!existing) {
      throw new Error(`Computer with ID ${id} not found.`);
    }

    // If model_id is being updated, verify it exists
    if (data.model_id && data.model_id !== existing.model_id) {
      const model = await this.modelRepository.getModel(data.model_id);
      if (!model) {
        throw new Error(`Model with ID ${data.model_id} not found.`);
      }
    }

    // Check for duplicate QR code if being updated
    if (data.qr_code && data.qr_code !== existing.qr_code) {
      const duplicate = await this.computerRepository.getComputerByQrCode(data.qr_code);
      if (duplicate && duplicate.id !== id) {
        throw new Error(`Computer with QR code "${data.qr_code}" already exists.`);
      }
    }

    return this.computerRepository.updateComputer({ ...data, id });
  }

  async deleteComputer(id: number): Promise<any> {
    const existing = await this.computerRepository.getComputer(id);
    if (!existing) {
      throw new Error(`Computer with ID ${id} not found.`);
    }
    return this.computerRepository.deleteComputer(id);
  }
}