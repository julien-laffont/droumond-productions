import { defineConfig, devices } from '@playwright/test';
import { DIST, PORT } from './tests/pages';

// The suite runs against the build already made (npm run build), served by astro preview.
// The tests of the Lighthouse checker (tests/lighthouse/) run only once, in their own project.
// The Publishing confirmation (tests/publish/) only runs with npm run confirm, against the host.
export default defineConfig({
	testDir: 'tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
	use: { baseURL: `http://localhost:${PORT}` },
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
			testIgnore: ['lighthouse/**', 'publish/**'],
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
			testIgnore: ['lighthouse/**', 'publish/**'],
		},
		{ name: 'lighthouse', testMatch: 'lighthouse/**/*.spec.ts' },
	],
	// --ignore-lock: starts even when another preview server (npm run preview) is running.
	webServer: {
		command: `npx astro preview --outDir ${DIST} --port ${PORT} --ignore-lock`,
		port: PORT,
		reuseExistingServer: !process.env.CI,
	},
});
