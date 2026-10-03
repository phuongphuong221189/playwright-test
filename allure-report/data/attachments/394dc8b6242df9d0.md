# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test_login.spec.ts >> Login Module Tests >> Basic SQL Injection attempt
- Location: test_login.spec.ts:337:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.alert-danger')
Expected substring: "Invalid email or password"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.alert-danger')

```

```yaml
- link "Perfex CRM | Anh Tester Demo":
  - /url: https://crm.anhtester.com/
  - img "Perfex CRM | Anh Tester Demo"
- heading "Login" [level=1]
- text: Email Address
- textbox "Email Address": "' OR 1=1 --"
- text: Password
- textbox "Password": "123456"
- checkbox "Remember me"
- text: Remember me
- button "Login"
- link "Forgot Password?":
  - /url: https://crm.anhtester.com/admin/authentication/forgot_password
```

# Test source

```ts
  262 |         await attachScreenshot(page, 'Validation lỗi — định dạng email không hợp lệ');
  263 |       });
  264 |     });
  265 |   });
  266 | 
  267 |   // 8. Kiểm tra tính năng "Remember Me"
  268 |   test('Remember Me functionality', async ({ context, page }) => {
  269 |     await allure.step('Mở trang đăng nhập', async () => {
  270 |       await allure.step(`Điều hướng đến URL: "${BASE_URL}"`, async () => {
  271 |         await page.goto(BASE_URL);
  272 |       });
  273 |     });
  274 | 
  275 |     await allure.step('Nhập thông tin hợp lệ và tích chọn "Remember Me"', async () => {
  276 |       await allure.step(`Điền giá trị "admin@example.com" vào trường Email [${locators.emailInput}]`, async () => {
  277 |         await page.fill(locators.emailInput, 'admin@example.com');
  278 |       });
  279 |       await allure.step(`Điền giá trị "123456" vào trường Password [${locators.passwordInput}]`, async () => {
  280 |         await page.fill(locators.passwordInput, '123456');
  281 |       });
  282 |       await allure.step(`Tích chọn checkbox "Remember Me" [${locators.rememberMeCheckbox}]`, async () => {
  283 |         await page.check(locators.rememberMeCheckbox);
  284 |       });
  285 |     });
  286 | 
  287 |     await allure.step('Nhấn nút Login và chờ chuyển đến Dashboard', async () => {
  288 |       await allure.step(`Click vào nút Login [${locators.loginButton}]`, async () => {
  289 |         await page.click(locators.loginButton);
  290 |       });
  291 |       await allure.step('Chờ trang chuyển hướng đến URL pattern: "**/admin/"', async () => {
  292 |         await page.waitForURL('**/admin/');
  293 |       });
  294 |     });
  295 | 
  296 |     await allure.step('Mở tab mới — xác nhận session vẫn còn hiệu lực (không bị redirect về trang đăng nhập)', async () => {
  297 |       await allure.step('Mở tab trình duyệt mới trong cùng context (dùng chung session cookies)', async () => {
  298 |         const newPage = await context.newPage();
  299 |         await allure.step('Điều hướng tab mới đến URL: "https://crm.anhtester.com/admin/"', async () => {
  300 |           await newPage.goto('https://crm.anhtester.com/admin/');
  301 |         });
  302 |         await allure.step('Kiểm tra URL tab mới KHÔNG khớp pattern "**/authentication"', async () => {
  303 |           await expect(newPage).not.toHaveURL('**/authentication');
  304 |         });
  305 |         await allure.step('Kiểm tra URL tab mới = "https://crm.anhtester.com/admin/"', async () => {
  306 |           await expect(newPage).toHaveURL('https://crm.anhtester.com/admin/');
  307 |         });
  308 |         await allure.step('Chụp ảnh màn hình xác nhận session còn hiệu lực', async () => {
  309 |           await attachScreenshot(newPage, 'Session vẫn còn hiệu lực sau khi mở tab mới');
  310 |         });
  311 |       });
  312 |     });
  313 |   });
  314 | 
  315 |   // 9. Kiểm tra tính bảo mật của ô Password (Masking)
  316 |   test('Password masking', async ({ page }) => {
  317 |     await allure.step('Mở trang đăng nhập', async () => {
  318 |       await allure.step(`Điều hướng đến URL: "${BASE_URL}"`, async () => {
  319 |         await page.goto(BASE_URL);
  320 |       });
  321 |     });
  322 | 
  323 |     await allure.step('Xác nhận trường Password có type="password" — ký tự bị ẩn dạng masking', async () => {
  324 |       await allure.step(`Lấy phần tử trường Password [${locators.passwordInput}]`, async () => {
  325 |         const passwordField = page.locator(locators.passwordInput);
  326 |         await allure.step(`Kiểm tra attribute type = "password" trên element [${locators.passwordInput}]`, async () => {
  327 |           await expect(passwordField).toHaveAttribute('type', 'password');
  328 |         });
  329 |       });
  330 |       await allure.step('Chụp ảnh màn hình trường Password đang hiển thị dạng masking', async () => {
  331 |         await attachScreenshot(page, 'Trường Password hiển thị dạng masking (•••)');
  332 |       });
  333 |     });
  334 |   });
  335 | 
  336 |   // 10. Kiểm tra khả năng chống SQL Injection cơ bản
  337 |   test('Basic SQL Injection attempt', async ({ page }) => {
  338 |     await allure.step('Mở trang đăng nhập', async () => {
  339 |       await allure.step(`Điều hướng đến URL: "${BASE_URL}"`, async () => {
  340 |         await page.goto(BASE_URL);
  341 |       });
  342 |     });
  343 | 
  344 |     await allure.step('Nhập payload SQL Injection vào trường Email', async () => {
  345 |       await allure.step(`Điền giá trị "' OR 1=1 --" vào trường Email [${locators.emailInput}]`, async () => {
  346 |         await page.fill(locators.emailInput, "' OR 1=1 --");
  347 |       });
  348 |       await allure.step(`Điền giá trị "123456" vào trường Password [${locators.passwordInput}]`, async () => {
  349 |         await page.fill(locators.passwordInput, '123456');
  350 |       });
  351 |     });
  352 | 
  353 |     await allure.step('Nhấn nút Login', async () => {
  354 |       await allure.step(`Click vào nút Login [${locators.loginButton}]`, async () => {
  355 |         await page.click(locators.loginButton);
  356 |       });
  357 |     });
  358 | 
  359 |     await allure.step('Xác nhận hệ thống không bị bypass — hiển thị lỗi và không có SQL error trong response', async () => {
  360 |       await allure.step(`Kiểm tra element [${locators.alertError}] chứa text "Invalid email or password"`, async () => {
  361 |         const errorMsg = page.locator(locators.alertError);
> 362 |         await expect(errorMsg).toContainText('Invalid email or password');
      |                                ^ Error: expect(locator).toContainText(expected) failed
  363 |       });
  364 |       await allure.step('Lấy toàn bộ HTML content của trang hiện tại', async () => {
  365 |         const pageContent = await page.content();
  366 |         await allure.step('Kiểm tra HTML response KHÔNG chứa chuỗi "sql syntax"', async () => {
  367 |           expect(pageContent.toLowerCase()).not.toContain('sql syntax');
  368 |         });
  369 |         await allure.step('Kiểm tra HTML response KHÔNG chứa chuỗi "mysql error"', async () => {
  370 |           expect(pageContent.toLowerCase()).not.toContain('mysql error');
  371 |         });
  372 |       });
  373 |       await allure.step('Chụp ảnh màn hình xác nhận hệ thống chặn SQL Injection thành công', async () => {
  374 |         await attachScreenshot(page, 'Hệ thống chặn SQL Injection thành công');
  375 |       });
  376 |     });
  377 |   });
  378 | });
  379 | 
```