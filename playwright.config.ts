import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory — giữ nguyên vị trí spec file hiện tại
  testDir: '.',

  // Timeout per test
  timeout: 30_000,

  // Retry failed tests once (để trace & video được giữ lại)
  retries: 1,

  // Parallel workers
  workers: 1,

  // ─── Reporters ───────────────────────────────────────────────────────────────
  reporter: [
    // Built-in line reporter cho terminal output
    ['line'],
    // Built-in HTML report (giữ tương thích cũ, output vào playwright-report/)
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    // Allure reporter — raw data vào allure-results/
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: true,
      // Tự động attach screenshot & video vào Allure report
      attachments: {
        screenshots: 'only-on-failure',
        videos: 'only-on-failure',
        traces: 'only-on-failure',
      },
    }],
  ],

  // ─── Global Test Settings ─────────────────────────────────────────────────
  use: {
    // Screenshot: tự động chụp khi test fail
    screenshot: 'only-on-failure',

    // Video: ghi lại execution, giữ khi fail
    video: 'retain-on-failure',

    // Trace: thu thập khi retry lần đầu
    trace: 'on-first-retry',

    // Thư mục chứa artifacts (screenshot, video, trace)
    // Allure reporter sẽ đọc từ đây để đính kèm vào report
  },

  // ─── Output Directory ─────────────────────────────────────────────────────
  // Playwright lưu test artifacts (screenshot, video, trace) tại đây
  outputDir: 'test-results',

  // ─── Projects / Browsers ──────────────────────────────────────────────────
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment để chạy thêm browsers:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
