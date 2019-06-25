import { CardiganModule } from './cardigan.module';

describe('CardiganModule', () => {
  let cardiganModule: CardiganModule;

  beforeEach(() => {
    cardiganModule = new CardiganModule();
  });

  it('should create an instance', () => {
    expect(cardiganModule).toBeTruthy();
  });
});
