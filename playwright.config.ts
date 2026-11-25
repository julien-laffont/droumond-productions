import { defineConfig, devices } from '@playwright/test';
import { BUILDS } from './tests/pages';

// The suite runs against the builds already made (npm run build and npm run build:english),
// each served by astro preview on its own port.
// The tests of the Lighthouse checker (tests/lighthouse/) run only once, in their own project.
// The Publishing confirmation (tests/publish/) only runs with npm run confirm, against the host.
export default defineConfig({
	testDir: 'tests',
	fullyParallel: true,
	repeatEach: 5,
	forbidOnly: !!process.env.CI,
	reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
			testIgnore: ['lighthouse/**', 'publish/**'],
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
			testMatch: ['projects.spec.ts', 'zz-probe.spec.ts'],
		},
		{ name: 'lighthouse', testMatch: 'lighthouse/**/*.spec.ts' },
	],
	// --ignore-lock: starts even when another preview server (npm run preview) is running.
	webServer: BUILDS.map((build) => ({
		command: `npx astro preview --outDir ${build.dist} --port ${build.port} --ignore-lock`,
		port: build.port,
		reuseExistingServer: !process.env.CI,
	})),
});
