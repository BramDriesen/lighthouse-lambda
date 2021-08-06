'use strict';

const lighthouse = require('lighthouse');
const log = require('lighthouse-logger');
const chromium = require('chrome-aws-lambda');

exports.handler = async (event) => {
  let response = null;
  let browser = null;
  let body = null;
  log.setLevel('error');

  // Parse the JSON Body.
  if (event.body) {
    body = JSON.parse(event.body);
  }

  try {
    // Instantiate our browser.
    browser = await chromium.puppeteer.launch({
      args: [...chromium.args, '--remote-debugging-port=9222'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    // Lighthouse options.
    const options = {
      output: 'html',
      preset: body.preset || 'mobile',
      onlyCategories: body.onlyCategories || ['performance', 'seo', 'accessibility', 'best-practices'],
      port: 9222,
    }

    // Generate the report.
    const report = await lighthouse(body.url, options);

    // Only return what we need, otherwise we might exceed the max response size of a Lambda.
    let responseBody = {
      json: report.lhr,
      html: report.report
    };

    response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(responseBody)
    };

  } catch (error) {
    console.log(error);

    response = {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: error.message
    }
  } finally {
    // Destroy our browser.
    if (browser !== null) {
       await browser.close();
    }
  }

  console.log("response: " + JSON.stringify(response))
  return response;
};
