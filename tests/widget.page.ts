import {Page} from "@playwright/test";

enum WidgetPageSelectors {
    WRAPPER = '.sc-dino-typography-h > [class^=widget__]',
    WIDGET_BODY = '[class^=widgetWrapper] > [class^=widget__]',
    HEADER_TEXT = 'header h5',
    BUTTON_OPEN = '[data-test=openWidget]',
    BUTTON_WRITE_TO_US = '[class^=btn__]',
    BUTTON_CLOSE = 'button[class^=closeBtn]',
    ARTICLE_POPULAR_TITLE = '[class^=popularTitle__]',
    ARTICLE_POPULAR_LIST = `${ARTICLE_POPULAR_TITLE} + ul[class^=articles__]`,
    ARTICLE_POPULAR_LIST_ITEM = `${ARTICLE_POPULAR_LIST} > li`,
}

export class WidgetPage {
    static selector = WidgetPageSelectors;

    constructor(protected page: Page) {}

    wrapper() {
        return this.page.locator(WidgetPage.selector.WRAPPER)
    }

    async openWidget() {
        // Кнопка появляется раньше, чем window.supportWidget. Ранний клик открывает оболочку без статей.
        await this.page.waitForFunction('() => !!(window.supportWidget && window.supportWidget.open)');
        return this.wrapper().locator(WidgetPage.selector.BUTTON_OPEN).click();
    }

    popularArticles() {
        return this.wrapper().locator(WidgetPage.selector.ARTICLE_POPULAR_LIST_ITEM)
    }

    async clickWriteToUs() {
        return this.wrapper()
            .locator(WidgetPage.selector.BUTTON_WRITE_TO_US)
            .filter({ hasText: /написать нам/i })
            .click();
    }

    async closeWidget() {
        return this.wrapper().locator(WidgetPage.selector.BUTTON_CLOSE).click();
    }

    getTitle() {
        return this.wrapper().locator(WidgetPage.selector.HEADER_TEXT);
    }

    getWidgetBody() {
        return this.page.locator(WidgetPage.selector.WIDGET_BODY);
    }
}

