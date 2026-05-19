describe('Basic user flow for Website', () => {
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
    await page.waitForSelector('product-item');
  });

  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    const prodItemsData = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => item.data);
    });

    for (let i = 0; i < prodItemsData.length; i++) {
      expect(prodItemsData[i].title.length).toBeGreaterThan(0);
      expect(prodItemsData[i].price).toBeDefined();
      expect(prodItemsData[i].price).toBeGreaterThan(0);
      expect(prodItemsData[i].image.length).toBeGreaterThan(0);
    }
  }, 10000);

  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');

    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector('product-item');

    const product = await page.$('product-item');
    const shadowRoot = await product.evaluateHandle(el => el.shadowRoot);
    const button = await shadowRoot.$('button');

    await button.click();

    const buttonText = await page.evaluate(button => button.innerText, button);

    expect(buttonText).toBe('Remove from Cart');
  }, 10000);

  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');

    await page.evaluate(() => {
      document.querySelectorAll('product-item').forEach(item => {
        const button = item.shadowRoot.querySelector('button');

        if (button.innerText === 'Add to Cart') {
          button.click();
        }
      });
    });

    await page.waitForFunction(() => {
      return document.querySelector('#cart-count').innerText === '20';
    });

    const cartCount = await page.$eval('#cart-count', el => el.innerText);

    expect(cartCount).toBe('20');
  }, 20000);

  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    await page.reload();
    await page.waitForSelector('product-item');

    await page.waitForFunction(() => {
      return document.querySelector('#cart-count').innerText === '20';
    });

    const products = await page.$$('product-item');

    for (const product of products) {
      const shadowRoot = await product.evaluateHandle(el => el.shadowRoot);
      const button = await shadowRoot.$('button');
      const buttonText = await page.evaluate(button => button.innerText, button);

      expect(buttonText).toBe('Remove from Cart');
    }

    const cartCount = await page.$eval('#cart-count', el => el.innerText);

    expect(cartCount).toBe('20');
  }, 20000);

  it('Checking the localStorage to make sure cart is correct', async () => {
    const cart = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });

    expect(cart).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');
  });

  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');

    await page.evaluate(() => {
      document.querySelectorAll('product-item').forEach(item => {
        const button = item.shadowRoot.querySelector('button');

        if (button.innerText === 'Remove from Cart') {
          button.click();
        }
      });
    });

    await page.waitForFunction(() => {
      return document.querySelector('#cart-count').innerText === '0';
    });

    const cartCount = await page.$eval('#cart-count', el => el.innerText);

    expect(cartCount).toBe('0');
  }, 20000);

  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    await page.reload();
    await page.waitForSelector('product-item');

    await page.waitForFunction(() => {
      return document.querySelector('#cart-count').innerText === '0';
    });

    const products = await page.$$('product-item');

    for (const product of products) {
      const shadowRoot = await product.evaluateHandle(el => el.shadowRoot);
      const button = await shadowRoot.$('button');
      const buttonText = await page.evaluate(button => button.innerText, button);

      expect(buttonText).toBe('Add to Cart');
    }

    const cartCount = await page.$eval('#cart-count', el => el.innerText);

    expect(cartCount).toBe('0');
  }, 20000);

  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');

    const cart = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });

    expect(cart).toBe('[]');
  });
});