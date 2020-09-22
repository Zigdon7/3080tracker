'use strict';
const express = require('express');
const puppeteer = require('puppeteer');
const iPhone = puppeteer.devices['iPhone 6'];

// Constants
const PORT = 80;
const HOST = '0.0.0.0';

// App
const app = express();
app.listen(PORT, HOST);

app.get('/', (req, res) => {
  res.send('Hello\n');
});

app.get("/amazon", async (req, res, next) => {
  const browser = await puppeteer.launch(({ args: ['--no-sandbox'] }));
  const page = await browser.newPage();

  await gotoPage(page, 'https://www.amazon.com/stores/GeForce/RTX3080_GEFORCERTX30SERIES/page/6B204EA4-AAAC-4776-82B1-D7C3BD9DDC82?tag=igndealstwitter-20&ascsubtag=07GjhUzdUz26OVxHKB5xZyA');

  const availableList = await page.evaluate(() => {

    var items = document.querySelectorAll('.fulfillment-add-to-cart-button');

    var itemList = [];
    var counter = 0;

    items.forEach((item)=> {
      var isSoldOut = item.querySelector('button').innerText == "Sold Out";        
      if(isSoldOut){
        itemList.push(document.querySelectorAll('.sku-header')[counter].querySelector('a').href);
      }
    });
    counter++;
    return itemList;
  })

  browser.close();

  res.send('availableList');
});

app.get("/bestbuy", async (req, res, next) => {
  const browser = await puppeteer.launch(({ args: ['--no-sandbox'] }));
  const page = await browser.newPage();

  await gotoPage(page, 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~NVIDIA%20GeForce%20RTX%203080')
  const availableList = await page.evaluate(() => {

    var items = document.querySelectorAll('.fulfillment-add-to-cart-button');

    var itemList = [];
    var counter = 0;

    items.forEach((item)=> {
      var isSoldOut = item.querySelector('button').innerText == "Sold Out";        
      if(!isSoldOut){
        itemList.push(document.querySelectorAll('.sku-header')[counter].querySelector('a').href);
      }
    });
    counter++;
    return itemList;
  })
  browser.close();
  res.send(availableList);
});

app.get("/evga", async (req, res, next) => {
  const browser = await puppeteer.launch(({ args: ['--no-sandbox'] }));
  const page = await browser.newPage();

  await gotoPage(page, 'https://www.evga.com/products/productlist.aspx?type=0&family=GeForce+30+Series+Family&chipset=RTX+3080')

  const availableList = await page.evaluate(() => {

    var items = document.querySelectorAll('.pl-list-info');

    var itemList = [];
    var counter = 0;

    items.forEach((item)=> {
      var isSoldOut = item.querySelector('.message-information').innerText == "OUT OF STOCK";        
      if(!isSoldOut){
        itemList.push(item.querySelector('.pl-list-pname a').href);
      }
    });
    counter++;
    return itemList;
  })

  browser.close();
  res.send(availableList);
});

app.get("/newegg", async (req, res, next) => {
  const browser = await puppeteer.launch(({ args: ['--no-sandbox'] }));
  const page = await browser.newPage();
  
  await gotoPage(page, 'https://www.newegg.com/p/pl?N=100007709%20601357247%204841&cm_sp=Cat_video-Cards_1-_-Visnav-_-Gaming-Video-Cards_1&cm_mmc=snc-twitter-_-promo-_-brd-nvidia-3080-psa-_-091620')
  
  const availableList = await page.evaluate(() => {

    var items = document.querySelectorAll('.item-container');

    var itemList = [];
    var counter = 0;

    items.forEach((item)=> {
      var isSoldOut = item.querySelector('.item-promo').innerText == "OUT OF STOCK";        
      if(!isSoldOut){
        itemList.push(item.querySelector('.item-info a').href);
      }
    });
    counter++;
    return itemList;
  })

  browser.close();
  res.send(availableList);
});

app.get("/nvidia", async (req, res, next) => {
  const browser = await puppeteer.launch(({ args: ['--no-sandbox'] }));
  const page = await browser.newPage();

  await gotoPage(page, 'https://www.nvidia.com/en-us/shop/geforce/gpu/?page=1&limit=9&locale=en-us&category=GPU&gpu=RTX%203080')

  const availableList = await page.evaluate(() => {

    var items = document.querySelectorAll('.product-details-list-tile');

    var itemList = [];
    var counter = 0;

    items.forEach((item)=> {
      if(item.querySelector('h2').innerHTML == "NVIDIA GEFORCE RTX 3080"){
        var isSoldOut = item.querySelector('.featured-buy-link').innerText != "OUT OF STOCK";        
        if(isSoldOut){
          itemList.push('https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3080/');
        }
      }
      counter++;
    });
    return itemList;
  })

  browser.close();
  res.send(availableList);
});

async function gotoPage(page, url) {
  await page.setViewport({ width: 1920, height: 1080 })
  await page.setDefaultNavigationTimeout(0);


  await page.goto(url);
  await page.waitFor(5000);
  await page.screenshot({ path: 'screenshots/'+ url.split(".")[1] + '.png' });

  return page;
}