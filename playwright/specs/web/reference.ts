import { test, expect } from '@playwright/test';
import { POManager } from '../../pageobjects/POManager';
const  datasets = JSON.parse(JSON.stringify(require("../../testdata/loginTestData.json")));
const productData = require("../../testdata/prodcustTestData.json");
import * as allure from "allure-js-commons";

test.describe("Cart Test Suite", () => {
    test.beforeEach(async ({ page, baseURL }) => {
      await page.goto(baseURL || "https://www.saucedemo.com/");
      const poManager = new POManager(page);
      const loginPage = poManager.getLoginPage();
      await loginPage.validLogin(datasets[0].username, datasets[0].password);
    });
  
    test("Add a Product to the cart",{ tag: '@smoke',}, async ({ page }) => {
      allure.displayName("Add a Product to the cart");
      allure.description(
        "This test is to validate the functionality of adding a product to the cart"
      );
      allure.epic("Cart");
      allure.feature("Cart Feature");
      const poManager = new POManager(page);
      const productsPage = poManager.getProductsPage();
      await productsPage.addProduct(productData.name);
      await productsPage.clickCartButton();
      allure.logStep("Selected Product is added to the cart "+productData.name);
      allure.logStep("Clicked on Cart Button");
      const cartPage = poManager.getCartPage();
      await expect(cartPage.removeButton).toBeVisible();
      allure.logStep("Product is added to the cart");
    });
  
    test("Remove a Product from the cart- Intentionally fail",{ tag: '@regression',}, async ({
      page,
    }) => {
      allure.displayName("Remove a Product from the cart");
      allure.description(
          "This test is to validate the functionality of removing a product from the cart");
      allure.epic("Cart");
      allure.feature("Cart Feature");
      const poManager = new POManager(page);
      const productsPage = poManager.getProductsPage();
      await productsPage.addProduct(productData.name);
      allure.logStep("Selected Product is added to the cart "+productData.name);
      await productsPage.clickCartButton();
      const cartPage = poManager.getCartPage();
      await cartPage.clickRemoveButton();
      allure.logStep("Clicked on Remove Button");
      //await expect(cartPage.removeButton).not.toBeVisible();
      await expect(cartPage.removeButton).toBeVisible(); // Intentionally failing the test
      allure.logStep("Product is removed from the cart");
    });
  
  
    
  });