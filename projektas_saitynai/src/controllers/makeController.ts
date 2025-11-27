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
import { MakeService } from '../services/makeService';
import { Make } from '../repositories/makeRepository';
import { iocContainer } from '../ioc/inversify.config';

const authService = iocContainer.get<AuthService>(TYPES.authService);

@controller('/makes')
export class MakeController extends BaseHttpController {
  constructor(@inject(TYPES.makeService) private readonly makeService: MakeService) {
    super();
  }

  @httpGet('/')
  private async getAll() {
    const makes = await this.makeService.getAllMakes();
    return this.ok(makes);
  }

  @httpGet('/:id')
  private async getById(@requestParam('id') id: number) {
    try {
      if (id <= 0) {
        return this.badRequest('Make id has to be a positive integer');
      }
      const make = await this.makeService.getMake(id);
      if (!make) {
        return this.notFound();
      }
      return this.ok(make);
    } catch {
      return this.badRequest('Make id has to be a positive integer');
    }
  }

  @httpPost('/', authService.authenticate([Role.Admin]))
  private async create(@requestBody() body: Partial<Make>) {
    if (_.isEmpty(body)) {
      return this.badRequest('Request body cannot be empty.');
    }
    if (body.id) {
      return this.badRequest('ID field is not allowed when creating a new Make.');
    }

    try {
      const make = await this.makeService.createMake(body);
      return this.created('/makes', make);
    } catch (err: any) {
      if (err.message.includes('already exists')) {
        return this.badRequest(err.message);
      }
      return this.badRequest('Could not create Make object');
    }
  }

  @httpPut('/:id', authService.authenticate([Role.Admin]))
  private async update(@requestParam('id') id: number, @requestBody() body: Partial<Make>) {
    try {
      if (id <= 0) {
        return this.badRequest('Make id has to be a positive integer');
      }
      if (body.id) {
        return this.badRequest('ID field is not allowed when updating a Make.');
      }

      const updated = await this.makeService.updateMake(id, body);
      return this.ok(updated);
    } catch (err: any) {
      if (err.message.includes('not found')) {
        return this.notFound();
      }
      if (err.message.includes('already exists')) {
        return this.badRequest(err.message);
      }
      return this.badRequest(`Could not update Make with id: ${id}`);
    }
  }

  @httpDelete('/:id', authService.authenticate([Role.Admin]))
  private async delete(@requestParam('id') id: number) {
    try {
      if (id <= 0) {
        return this.badRequest('Make id has to be a positive integer');
      }
      const deleted = await this.makeService.deleteMake(id);
      return this.ok(deleted);
    } catch {
      return this.notFound();
    }
  }
}