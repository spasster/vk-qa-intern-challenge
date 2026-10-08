import { test, expect } from '@playwright/test';
import {WidgetPage} from "./widget.page";

test.describe('Uchi.ru widget ', () => {
  let widgetPage: WidgetPage;

  test.beforeEach(async ({page}) => {
    widgetPage = new WidgetPage(page);

    // Без этой куки главная иногда открывается в редизайне, где виджета нет.
    await page.context().addCookies([
      { name: 'ab_mainpage_redesign', value: 'a', url: 'https://uchi.ru' },
      { name: 'mainpage_tech_ab', value: 'a', url: 'https://uchi.ru' },
    ]);

    // open uchi.ru main page
    await page.goto('/', { waitUntil: 'domcontentloaded' }).catch(() =>
      page.goto('/', { waitUntil: 'domcontentloaded' })
    );

    // Баннер кук появляется не сразу, и кнопок «ОК» на странице две.
    const cookie = page.locator('._UCHI_COOKIE__button').filter({ visible: true });
    try {
      await cookie.first().waitFor({ state: 'visible', timeout: 8000 });
      await cookie.first().click();
    } catch {
      // баннера нет
    }
  });

  test('opens', async () => {
    await widgetPage.openWidget();

    await expect(widgetPage.getWidgetBody()).toBeVisible()
  });

  test('has correct title', async () => {
    await widgetPage.openWidget();

    await widgetPage.popularArticles().first().click();

    await widgetPage.clickWriteToUs();

    await expect(widgetPage.getTitle()).toHaveText('Связь с поддержкой');
  });

  test('closes', async () => {
    await widgetPage.openWidget();

    await expect(widgetPage.getWidgetBody()).toBeVisible();

    await widgetPage.closeWidget();

    await expect(widgetPage.getWidgetBody()).toBeHidden();
  });
});
