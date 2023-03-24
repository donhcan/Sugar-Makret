import puppeteer from 'puppeteer';
import { Product } from './entity/Product';
import { AppDataSource } from './data-source';


const COUNTRIES = {
    'Uganda': 'https://www.jumia.ug',
    'Kenya': 'https://www.jumia.co.ke',
    'Nigeria': 'https://www.jumia.com.ng',
  };

  async function scrapeJumia(): Promise<void> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url ='https://www.jumia.ug/catalog/?q=sugar+1kg';
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
  
    
  
  
    const today = new Date();
    for (const product of products) {
      const dbProduct = new Product();
      dbProduct.name = product.name;
      dbProduct.price = 100;
  
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