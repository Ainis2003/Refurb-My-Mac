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
import { ModelService } from '../services/modelService';
import { Model } from '../repositories/modelRepository';
import { iocContainer } from '../ioc/inversify.config';

const authService = iocContainer.get<AuthService>(TYPES.authService);

@controller('/models')
export class ModelController extends BaseHttpController {
  constructor(@inject(TYPES.modelService) private readonly modelService: ModelService) {
    super();
  }

  @httpGet('/')
  private async getAll() {
    const models = await this.modelService.getAllModels();
    return this.ok(models);
  }

  @httpGet('/:id')
  private async getById(@requestParam('id') id: number) {
    try {
      if (id <= 0) {
        return this.badRequest('Model id has to be a positive integer');
      }
      const model = await this.modelService.getModel(id);
      if (!model) {
        return this.notFound();
      }
      return this.ok(model);
    } catch {
      return this.badRequest('Model id has to be a positive integer');
    }
  }

  @httpPost('/', authService.authenticate([Role.Admin]))
  private async create(@requestBody() body: Partial<Model>) {
    if (_.isEmpty(body)) {
      return this.badRequest('Request body cannot be empty.');
    }
    if (body.id) {
      return this.badRequest('ID field is not allowed when creating a new Model.');
    }

    try {
      const model = await this.modelService.createModel(body);
      return this.created('/models', model);
    } catch (err: any) {
      if (err.message.includes('already exists')) {
        return this.badRequest(err.message);
      }
      if (err.message.includes('not found') || err.message.includes('Missing required field')) {
        return this.badRequest(err.message);
      }
      return this.badRequest('Could not create Model object');
    }
  }

  @httpPut('/:id', authService.authenticate([Role.Admin]))
  private async update(@requestParam('id') id: number, @requestBody() body: Partial<Model>) {
    try {
      if (id <= 0) {
        return this.badRequest('Model id has to be a positive integer');
      }
      if (body.id) {
        return this.badRequest('ID field is not allowed when updating a Model.');
      }

      const updated = await this.modelService.updateModel(id, body);
      return this.ok(updated);
    } catch (err: any) {
      if (err.message.includes('not found')) {
        return this.notFound();
      }
      if (err.message.includes('already exists')) {
        return this.badRequest(err.message);
      }
      return this.badRequest(`Could not update Model with id: ${id}`);
    }
  }

  @httpDelete('/:id', authService.authenticate([Role.Admin]))
  private async delete(@requestParam('id') id: number) {
    try {
      if (id <= 0) {
        return this.badRequest('Model id has to be a positive integer');
      }
      const deleted = await this.modelService.deleteModel(id);
      return this.ok(deleted);
    } catch {
      return this.notFound();
    }
  }
}