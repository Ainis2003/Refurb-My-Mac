import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  requestParam,
  requestBody,
  BaseHttpController
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../ioc/types';
import { AuthService } from '../services/authService';
import { Role } from '../schema';
import _ from 'lodash';
import { ComputerService } from '../services/computerService';
import { Computer } from '../repositories/computerRepository';
import { iocContainer } from '../ioc/inversify.config';

const authService = iocContainer.get<AuthService>(TYPES.authService);

@controller('/computers')
export class ComputerController extends BaseHttpController {
  constructor(@inject(TYPES.computerService) private readonly computerService: ComputerService) {
    super();
  }

  // Both Admin and Repairman can view all computers
  @httpGet('/', authService.authenticate([Role.Admin, Role.Repairman]))
  private async getAll() {
    const computers = await this.computerService.getAllComputers();
    return this.ok(computers);
  }

  // Both Admin and Repairman can view a specific computer
  @httpGet('/:id', authService.authenticate([Role.Admin, Role.Repairman]))
  private async getById(@requestParam('id') id: number) {
    try {
      if (id <= 0) {
        return this.badRequest('Computer id has to be a positive integer');
      }
      const computer = await this.computerService.getComputer(id);
      if (!computer) {
        return this.notFound();
      }
      return this.ok(computer);
    } catch {
      return this.badRequest('Computer id has to be a positive integer');
    }
  }

  // Only Admin can create computers
  @httpPost('/', authService.authenticate([Role.Admin]))
  private async create(@requestBody() body: Partial<Computer>) {
    if (_.isEmpty(body)) {
      return this.badRequest('Request body cannot be empty.');
    }
    if (body.id) {
      return this.badRequest('ID field is not allowed when creating a new Computer.');
    }

    try {
      const computer = await this.computerService.createComputer(body);
      return this.created('/computers', computer);
    } catch (err: any) {
      if (err.message.includes('already exists')) {
        return this.badRequest(err.message);
      }
      if (err.message.includes('not found') || err.message.includes('Missing required field')) {
        return this.badRequest(err.message);
      }
      return this.badRequest('Could not create Computer object');
    }
  }

  // Both Admin and Repairman can update computers
  @httpPut('/:id', authService.authenticate([Role.Admin, Role.Repairman]))
  private async update(@requestParam('id') id: number, @requestBody() body: Partial<Computer>) {
    try {
      if (id <= 0) {
        return this.badRequest('Computer id has to be a positive integer');
      }
      if (body.id) {
        return this.badRequest('ID field is not allowed when updating a Computer.');
      }

      const updated = await this.computerService.updateComputer(id, body);
      return this.ok(updated);
    } catch (err: any) {
      if (err.message.includes('not found')) {
        return this.notFound();
      }
      if (err.message.includes('already exists')) {
        return this.badRequest(err.message);
      }
      return this.badRequest(`Could not update Computer with id: ${id}`);
    }
  }

  // Only Admin can delete computers
  @httpDelete('/:id', authService.authenticate([Role.Admin]))
  private async delete(@requestParam('id') id: number) {
    try {
      if (id <= 0) {
        return this.badRequest('Computer id has to be a positive integer');
      }
      const deleted = await this.computerService.deleteComputer(id);
      return this.ok(deleted);
    } catch {
      return this.notFound();
    }
  }
}