import './controllers';   // ADDED THIS

import { Container } from 'inversify';
import { TYPES } from './types';
import { AuthService } from '../services/authService';
import { AuthRepository } from '../repositories/authRepository';
import { Database } from '../services/database';

import { MakeRepository } from '../repositories/makeRepository';  // ADDED THIS
import { MakeService } from '../services/makeService';  // ADDED THIS
import { ModelRepository } from '../repositories/modelRepository';    // ADDED THIS
import { ModelService } from '../services/modelService';    // ADDED THIS
import { ComputerRepository } from '../repositories/computerRepository';    // ADDED THIS
import { ComputerService } from '../services/computerService';    // ADDED THIS

const createIocContainer = () => {
  const container = new Container();

  container.bind<AuthService>(TYPES.authService).to(AuthService).inSingletonScope();
  container.bind<AuthRepository>(TYPES.authRepository).to(AuthRepository).inSingletonScope();
  container.bind<Database>(TYPES.database).to(Database).inSingletonScope();

  container.bind<MakeRepository>(TYPES.makeRepository).to(MakeRepository);  // ADDED THIS
  container.bind<MakeService>(TYPES.makeService).to(MakeService);   // ADDED THIS
  container.bind<ModelRepository>(TYPES.modelRepository).to(ModelRepository);   // ADDED THIS
  container.bind<ModelService>(TYPES.modelService).to(ModelService);    // ADDED THIS
  container.bind<ComputerRepository>(TYPES.computerRepository).to(ComputerRepository);// ADDED THIS
container.bind<ComputerService>(TYPES.computerService).to(ComputerService);// ADDED THIS
  

  return container;
};

const iocContainer = createIocContainer();

export { iocContainer, createIocContainer };
