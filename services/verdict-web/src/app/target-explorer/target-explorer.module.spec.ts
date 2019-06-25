import { TargetExplorerModule } from './target-explorer.module';

describe('TargetExplorerModule', () => {
	let targetExplorerModule: TargetExplorerModule;

	beforeEach(() => {
		targetExplorerModule = new TargetExplorerModule();
	});

	it('should create an instance', () => {
		expect(targetExplorerModule).toBeTruthy();
	});
});
