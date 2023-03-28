
import "reflect-metadata";
import { DataSource } from 'typeorm';
import { Product } from './entity/Product';
import puppeteer from 'puppeteer';

const COUNTRIES = {
    'Uganda': 'https://www.jumia.ug',
    'Kenya': 'https://www.jumia.co.ke',
    'Nigeria': 'https://www.jumia.com.ng',
  };

  async function scrapeJumia(): Promise<void> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url ='http://127.0.0.1/products.html';
    await page.goto(url);
  
    const products = await page.$$eval(".prd a.core", (items) =>
      items.map((item) => {
        const name = item.querySelector("h3")?.textContent;
        const price = item.querySelector(".prc")?.textContent;
        return {
          name,
          price,
        };
      })
    );

    console.log(products);
  
    const AppDataSource = new DataSource({
        type: "postgres",
        host: "127.0.0.1",
        port: 5432,
        username: "test",
        password: "test",
        database: "test",
        entities: [Product],
        synchronize: true,
        logging: false,
    })
  
  
    const today = new Date();
    for (const product of products) {
      const dbProduct = new Product();
      dbProduct.name = product.name;
      dbProduct.price = product.price ? parseFloat(product.price.trim().replace(",", "")) : null;

      await AppDataSource.manager.save(dbProduct);
    }
  
    await browser.close();
    console.log("Scraping done!");
  }
  

  async function runScraper() {
    try {
      await scrapeJumia();
    } catch (error) {
      console.error(error);
    }
  }
  
  runScraper();