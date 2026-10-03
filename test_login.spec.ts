import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

const BASE_URL = 'https://crm.anhtester.com/admin/authentication';

// Locators
const locators = {
  emailInput: '#email',
  passwordInput: '#password',
  loginButton: 'button[type="submit"]',
  rememberMeCheckbox: '#remember',
  alertError: '.alert-danger',
  emailErrorText: '#email-error',
  passwordErrorText: '#password-error',
};

// Helper: chụp ảnh và đính kèm vào Allure report
async function attachScreenshot(page: any, label: string) {
  const screenshot = await page.screenshot({ fullPage: false });
  await allure.attachment(label, screenshot, 'image/png');
}

test.describe('Login Module Tests', () => {

  // 1. Đăng nhập thành công với thông tin hợp lệ
  test('Successful login with valid credentials', async ({ page }) => {
    await allure.step('Mở trang đăng nhập', async () => {
      await allure.step(`Điều hướng đến URL: "${BASE_URL}"`, async () => {
        await page.goto(BASE_URL);
      });
    });

    await allure.step('Nhập thông tin đăng nhập hợp lệ (email + mật khẩu)', async () => {
      await allure.step(`Điền giá trị "admin@example.com" vào trường Email [${locators.emailInput}]`, async () => {
        await page.fill(locators.emailInput, 'admin@example.com');
      });
      await allure.step(`Điền giá trị "123456" vào trường Password [${locators.passwordInput}]`, async () => {
        await page.fill(locators.passwordInput, '123456');
      });
    });

    await allure.step('Nhấn nút Login và chờ chuyển hướng', async () => {
      await allure.step(`Click vào nút Login [${locators.loginButton}]`, async () => {
        await page.click(locators.loginButton);
      });
      await allure.step('Chờ trang chuyển hướng đến URL pattern: "**/admin/"', async () => {
        await page.waitForURL('**/admin/');
      });
    });

    await allure.step('Xác nhận đăng nhập thành công — URL chuyển đến trang Dashboard', async () => {
      await allure.step('Kiểm tra URL hiện tại = "https://crm.anhtester.com/admin/"', async () => {
        await expect(page).toHaveURL('https://crm.anhtester.com/admin/');
      });
      await allure.step('Chụp ảnh màn hình Dashboard sau khi đăng nhập', async () => {
        await attachScreenshot(page, 'Dashboard sau khi đăng nhập thành công');
      });
    });
  });

  // 2. Đăng nhập với mật khẩu sai
  test('Login with invalid password', async ({ page }) => {
    await allure.step('Mở trang đăng nhập', async () => {
      await allure.step(`Điều hướng đến URL: "${BASE_URL}"`, async () => {
        await page.goto(BASE_URL);
      });
    });

    await allure.step('Nhập email hợp lệ và mật khẩu sai', async () => {
      await allure.step(`Điền giá trị "admin@example.com" vào trường Email [${locators.emailInput}]`, async () => {
        await page.fill(locators.emailInput, 'admin@example.com');
      });
      await allure.step(`Điền giá trị "sai_mat_khau_123" vào trường Password [${locators.passwordInput}]`, async () => {
        await page.fill(locators.passwordInput, 'sai_mat_khau_123');
      });
    });

    await allure.step('Nhấn nút Login', async () => {
      await allure.step(`Click vào nút Login [${locators.loginButton}]`, async () => {
        await page.click(locators.loginButton);
      });
    });

    await allure.step('Xác nhận hiển thị thông báo lỗi: "Invalid email or password"', async () => {
      await allure.step(`Kiểm tra element [${locators.alertError}] chứa text "Invalid email or password"`, async () => {
        const errorMsg = page.locator(locators.alertError);
        await expect(errorMsg).toContainText('Invalid email or password');
      });
      await allure.step('Chụp ảnh màn hình thông báo lỗi mật khẩu sai', async () => {
        await attachScreenshot(page, 'Thông báo lỗi khi nhập mật khẩu sai');
      });
    });
  });

  // 3. Đăng nhập với email không tồn tại
  test('Login with unregistered email', async ({ page }) => {
    await allure.step('Mở trang đăng nhập', async () => {
      await allure.step(`Điều hướng đến URL: "${BASE_URL}"`, async () => {
        await page.goto(BASE_URL);
      });
    });

    await allure.step('Nhập email chưa đăng ký và mật khẩu', async () => {
      await allure.step(`Điền giá trị "khongtontai@example.com" vào trường Email [${locators.emailInput}]`, async () => {
        await page.fill(locators.emailInput, 'khongtontai@example.com');
      });
      await allure.step(`Điền giá trị "123456" vào trường Password [${locators.passwordInput}]`, async () => {
        await page.fill(locators.passwordInput, '123456');
      });
    });

    await allure.step('Nhấn nút Login', async () => {
      await allure.step(`Click vào nút Login [${locators.loginButton}]`, async () => {
        await page.click(locators.loginButton);
      });
    });

    await allure.step('Xác nhận hiển thị thông báo lỗi: "Invalid email or password"', async () => {
      await allure.step(`Kiểm tra element [${locators.alertError}] chứa text "Invalid email or password"`, async () => {
        const errorMsg = page.locator(locators.alertError);
        await expect(errorMsg).toContainText('Invalid email or password');
      });
      await allure.step('Chụp ảnh màn hình thông báo lỗi email không tồn tại', async () => {
        await attachScreenshot(page, 'Thông báo lỗi khi nhập email không tồn tại');
      });
    });
  });

  // 4. Bỏ trống trường Email
  test('Login with empty email', async ({ page }) => {
    await allure.step('Mở trang đăng nhập', async () => {
      await allure.step(`Điều hướng đến URL: "${BASE_URL}"`, async () => {
        await page.goto(BASE_URL);
      });
    });

    await allure.step('Để trống Email, chỉ nhập mật khẩu', async () => {
      await allure.step(`Bỏ qua trường Email [${locators.emailInput}] — không nhập giá trị`, async () => {
        // Email field intentionally left empty
      });
      await allure.step(`Điền giá trị "123456" vào trường Password [${locators.passwordInput}]`, async () => {
        await page.fill(locators.passwordInput, '123456');
      });
    });

    await allure.step('Nhấn nút Login', async () => {
      await allure.step(`Click vào nút Login [${locators.loginButton}]`, async () => {
        await page.click(locators.loginButton);
      });
    });

    await allure.step('Xác nhận hiển thị validation: "The Email Address field is required"', async () => {
      await allure.step(`Kiểm tra element [${locators.emailErrorText}] hiển thị trên trang (visible)`, async () => {
        await expect(page.locator(locators.emailErrorText)).toBeVisible();
      });
      await allure.step(`Kiểm tra element [${locators.emailErrorText}] chứa text "The Email Address field is required"`, async () => {
        await expect(page.locator(locators.emailErrorText)).toContainText('The Email Address field is required');
      });
      await allure.step('Chụp ảnh màn hình validation lỗi trường Email', async () => {
        await attachScreenshot(page, 'Validation lỗi — trường Email bị trống');
      });
    });
  });

  // 5. Bỏ trống trường Password
  test('Login with empty password', async ({ page }) => {
    await allure.step('Mở trang đăng nhập', async () => {
      await allure.step(`Điều hướng đến URL: "${BASE_URL}"`, async () => {
        await page.goto(BASE_URL);
      });
    });

    await allure.step('Nhập email hợp lệ, để trống Password', async () => {
      await allure.step(`Điền giá trị "admin@example.com" vào trường Email [${locators.emailInput}]`, async () => {
        await page.fill(locators.emailInput, 'admin@example.com');
      });
      await allure.step(`Bỏ qua trường Password [${locators.passwordInput}] — không nhập giá trị`, async () => {
        // Password field intentionally left empty
      });
    });

    await allure.step('Nhấn nút Login', async () => {
      await allure.step(`Click vào nút Login [${locators.loginButton}]`, async () => {
        await page.click(locators.loginButton);
      });
    });

    await allure.step('Xác nhận hiển thị validation: "The Password field is required"', async () => {
      await allure.step(`Kiểm tra element [${locators.passwordErrorText}] hiển thị trên trang (visible)`, async () => {
        await expect(page.locator(locators.passwordErrorText)).toBeVisible();
      });
      await allure.step(`Kiểm tra element [${locators.passwordErrorText}] chứa text "The Password field is required"`, async () => {
        await expect(page.locator(locators.passwordErrorText)).toContainText('The Password field is required');
      });
      await allure.step('Chụp ảnh màn hình validation lỗi trường Password', async () => {
        await attachScreenshot(page, 'Validation lỗi — trường Password bị trống');
      });
    });
  });

  // 6. Bỏ trống cả hai trường Email và Password
  test('Login with empty email and password', async ({ page }) => {
    await allure.step('Mở trang đăng nhập', async () => {
      await allure.step(`Điều hướng đến URL: "${BASE_URL}"`, async () => {
        await page.goto(BASE_URL);
      });
    });

    await allure.step('Để trống cả Email và Password, nhấn nút Login', async () => {
      await allure.step(`Bỏ qua trường Email [${locators.emailInput}] và Password [${locators.passwordInput}] — không nhập giá trị`, async () => {
        // Both fields intentionally left empty
      });
      await allure.step(`Click vào nút Login [${locators.loginButton}]`, async () => {
        await page.click(locators.loginButton);
      });
    });

    await allure.step('Xác nhận hiển thị đồng thời cả hai thông báo validation lỗi', async () => {
      await allure.step(`Kiểm tra element [${locators.emailErrorText}] hiển thị (visible)`, async () => {
        await expect(page.locator(locators.emailErrorText)).toBeVisible();
      });
      await allure.step(`Kiểm tra element [${locators.passwordErrorText}] hiển thị (visible)`, async () => {
        await expect(page.locator(locators.passwordErrorText)).toBeVisible();
      });
      await allure.step('Chụp ảnh màn hình cả hai thông báo validation lỗi', async () => {
        await attachScreenshot(page, 'Validation lỗi — cả hai trường Email và Password trống');
      });
    });
  });

  // 7. Nhập sai định dạng Email
  test('Login with invalid email format', async ({ page }) => {
    await allure.step('Mở trang đăng nhập', async () => {
      await allure.step(`Điều hướng đến URL: "${BASE_URL}"`, async () => {
        await page.goto(BASE_URL);
      });
    });

    await allure.step('Nhập email sai định dạng (thiếu ký tự @) và mật khẩu', async () => {
      await allure.step(`Điền giá trị "admin_example.com" vào trường Email [${locators.emailInput}]`, async () => {
        await page.fill(locators.emailInput, 'admin_example.com');
      });
      await allure.step(`Điền giá trị "123456" vào trường Password [${locators.passwordInput}]`, async () => {
        await page.fill(locators.passwordInput, '123456');
      });
    });

    await allure.step('Nhấn nút Login', async () => {
      await allure.step(`Click vào nút Login [${locators.loginButton}]`, async () => {
        await page.click(locators.loginButton);
      });
    });

    await allure.step('Xác nhận hiển thị validation: "Please enter a valid email address"', async () => {
      await allure.step(`Kiểm tra element [${locators.emailErrorText}] hiển thị trên trang (visible)`, async () => {
        await expect(page.locator(locators.emailErrorText)).toBeVisible();
      });
      await allure.step(`Kiểm tra element [${locators.emailErrorText}] chứa text "Please enter a valid email address"`, async () => {
        await expect(page.locator(locators.emailErrorText)).toContainText('Please enter a valid email address');
      });
      await allure.step('Chụp ảnh màn hình validation lỗi định dạng email', async () => {
        await attachScreenshot(page, 'Validation lỗi — định dạng email không hợp lệ');
      });
    });
  });

  // 8. Kiểm tra tính năng "Remember Me"
  test('Remember Me functionality', async ({ context, page }) => {
    await allure.step('Mở trang đăng nhập', async () => {
      await allure.step(`Điều hướng đến URL: "${BASE_URL}"`, async () => {
        await page.goto(BASE_URL);
      });
    });

    await allure.step('Nhập thông tin hợp lệ và tích chọn "Remember Me"', async () => {
      await allure.step(`Điền giá trị "admin@example.com" vào trường Email [${locators.emailInput}]`, async () => {
        await page.fill(locators.emailInput, 'admin@example.com');
      });
      await allure.step(`Điền giá trị "123456" vào trường Password [${locators.passwordInput}]`, async () => {
        await page.fill(locators.passwordInput, '123456');
      });
      await allure.step(`Tích chọn checkbox "Remember Me" [${locators.rememberMeCheckbox}]`, async () => {
        await page.check(locators.rememberMeCheckbox);
      });
    });

    await allure.step('Nhấn nút Login và chờ chuyển đến Dashboard', async () => {
      await allure.step(`Click vào nút Login [${locators.loginButton}]`, async () => {
        await page.click(locators.loginButton);
      });
      await allure.step('Chờ trang chuyển hướng đến URL pattern: "**/admin/"', async () => {
        await page.waitForURL('**/admin/');
      });
    });

    await allure.step('Mở tab mới — xác nhận session vẫn còn hiệu lực (không bị redirect về trang đăng nhập)', async () => {
      await allure.step('Mở tab trình duyệt mới trong cùng context (dùng chung session cookies)', async () => {
        const newPage = await context.newPage();
        await allure.step('Điều hướng tab mới đến URL: "https://crm.anhtester.com/admin/"', async () => {
          await newPage.goto('https://crm.anhtester.com/admin/');
        });
        await allure.step('Kiểm tra URL tab mới KHÔNG khớp pattern "**/authentication"', async () => {
          await expect(newPage).not.toHaveURL('**/authentication');
        });
        await allure.step('Kiểm tra URL tab mới = "https://crm.anhtester.com/admin/"', async () => {
          await expect(newPage).toHaveURL('https://crm.anhtester.com/admin/');
        });
        await allure.step('Chụp ảnh màn hình xác nhận session còn hiệu lực', async () => {
          await attachScreenshot(newPage, 'Session vẫn còn hiệu lực sau khi mở tab mới');
        });
      });
    });
  });

  // 9. Kiểm tra tính bảo mật của ô Password (Masking)
  test('Password masking', async ({ page }) => {
    await allure.step('Mở trang đăng nhập', async () => {
      await allure.step(`Điều hướng đến URL: "${BASE_URL}"`, async () => {
        await page.goto(BASE_URL);
      });
    });

    await allure.step('Xác nhận trường Password có type="password" — ký tự bị ẩn dạng masking', async () => {
      await allure.step(`Lấy phần tử trường Password [${locators.passwordInput}]`, async () => {
        const passwordField = page.locator(locators.passwordInput);
        await allure.step(`Kiểm tra attribute type = "password" trên element [${locators.passwordInput}]`, async () => {
          await expect(passwordField).toHaveAttribute('type', 'password');
        });
      });
      await allure.step('Chụp ảnh màn hình trường Password đang hiển thị dạng masking', async () => {
        await attachScreenshot(page, 'Trường Password hiển thị dạng masking (•••)');
      });
    });
  });

  // 10. Kiểm tra khả năng chống SQL Injection cơ bản
  test('Basic SQL Injection attempt', async ({ page }) => {
    await allure.step('Mở trang đăng nhập', async () => {
      await allure.step(`Điều hướng đến URL: "${BASE_URL}"`, async () => {
        await page.goto(BASE_URL);
      });
    });

    await allure.step('Nhập payload SQL Injection vào trường Email', async () => {
      await allure.step(`Điền giá trị "' OR 1=1 --" vào trường Email [${locators.emailInput}]`, async () => {
        await page.fill(locators.emailInput, "' OR 1=1 --");
      });
      await allure.step(`Điền giá trị "123456" vào trường Password [${locators.passwordInput}]`, async () => {
        await page.fill(locators.passwordInput, '123456');
      });
    });

    await allure.step('Nhấn nút Login', async () => {
      await allure.step(`Click vào nút Login [${locators.loginButton}]`, async () => {
        await page.click(locators.loginButton);
      });
    });

    await allure.step('Xác nhận hệ thống không bị bypass — hiển thị lỗi và không có SQL error trong response', async () => {
      await allure.step(`Kiểm tra element [${locators.alertError}] chứa text "Invalid email or password"`, async () => {
        const errorMsg = page.locator(locators.alertError);
        await expect(errorMsg).toContainText('Invalid email or password');
      });
      await allure.step('Lấy toàn bộ HTML content của trang hiện tại', async () => {
        const pageContent = await page.content();
        await allure.step('Kiểm tra HTML response KHÔNG chứa chuỗi "sql syntax"', async () => {
          expect(pageContent.toLowerCase()).not.toContain('sql syntax');
        });
        await allure.step('Kiểm tra HTML response KHÔNG chứa chuỗi "mysql error"', async () => {
          expect(pageContent.toLowerCase()).not.toContain('mysql error');
        });
      });
      await allure.step('Chụp ảnh màn hình xác nhận hệ thống chặn SQL Injection thành công', async () => {
        await attachScreenshot(page, 'Hệ thống chặn SQL Injection thành công');
      });
    });
  });
});
