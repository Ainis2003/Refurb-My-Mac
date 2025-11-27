import _ from 'lodash';
import { injectable } from 'inversify';
import { Table } from '../schema';
import { BaseRepository } from './baseRepository';

export interface Computer {
  id: number;
  model_id: number;
  ram_option_id: number;
  ssd_option_id: number;
  purchase_price: number;
  purchase_date: string;
  sold_price: number | null;
  sold_date: string | null;
  status: string;
  primary_repairman_id: number | null;
  note: string | null;
  qr_code: string | null;
}

@injectable()
export class ComputerRepository extends BaseRepository {
  async getComputer(id?: number): Promise<Computer | null> {
    if (!id || id <= 0) {
      return null;
    }
    const [computer] = await this.get<Computer>(Table.Computers, '*', (query) => query.where('id', id));
    return computer || null;
  }

  async getAllComputers(): Promise<Computer[]> {
    return this.get<Computer>(Table.Computers, '*');
  }

  async getComputerByQrCode(qrCode: string): Promise<Computer | null> {
    const [computer] = await this.get<Computer>(Table.Computers, '*', (query) => query.where('qr_code', qrCode));
    return computer || null;
  }

  async createComputer(data: Partial<Computer>): Promise<Computer> {
    const [inserted] = await this.insert<Computer>(Table.Computers, [data]);
    return inserted;
  }

  async updateComputer(data: Partial<Computer>): Promise<Computer | null> {
    if (!data.id) {
      throw new Error('ID is required for update');
    }

    const { id, ...updateFields } = data;
    
    // First, get the existing computer to merge with updates
    const existing = await this.getComputer(id);
    if (!existing) {
      return null;
    }

    // Merge existing data with updates to ensure all required fields are present
    const completeData = {
      ...existing,
      ...updateFields,
      id
    };
    
    const [updated] = await this.upsert<Computer>(Table.Computers, [completeData]);
    
    return updated || null;
  }

  async deleteComputer(id: number): Promise<boolean> {
    const deleted = await this.hardDelete(Table.Computers, (query) => query.where('id', id));
    return deleted;
  }
}