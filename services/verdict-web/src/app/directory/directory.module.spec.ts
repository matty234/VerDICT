import { DirectoryModule } from './directory.module';

describe('DirectoryModule', () => {
	let directoryModule: DirectoryModule;

	beforeEach(() => {
		directoryModule = new DirectoryModule();
	});

	it('should create an instance', () => {
		expect(directoryModule).toBeTruthy();
	});
});
