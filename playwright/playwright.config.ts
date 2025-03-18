import { defineConfig, devices } from '@playwright/test';
import * as configs from '../configs/playwrightConfig.json';
import * as os from "node:os";

const env = process.env.ENV || 'dev';
const projectConfig = process.env.PROJECT;
const config = configs[env];
var testDir= '../playwright/specs';
console.log("TIMEOUT FROM CONFIG FILE: ",config.timeout);
var projects: any = []=[];
var isHeadless=configs.headless==undefined?true:configs.headless;
console.log("Headless Mode: ",isHeadless);
console.log("PROJECT CONFIG: ",projectConfig);
if(projectConfig === 'chrome'){
  projects=configs.testChrome;
}
else if(projectConfig === 'firefox'){
  projects=configs.testFirefox;
}
else if(projectConfig === 'webkit'){
  projects=configs.testSafari;
}
else if(projectConfig === 'edge'){
  projects=configs.testEdge
}
else if(projectConfig === 'all'){
  projects=configs.testAllBrowsers;
}else if(projectConfig === 'api'){
  projects=configs.testApi;
  testDir='../playwright/specs/';
  var testDir= '../playwright/specs/apis/';
}else{
  projects=[
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    }
  ]
}

export const apiConfig = {
  baseURL: config.backendHostingUrl,
  authToken:'sample'
};

console.log("PROJECT CONFIG VALUE: ",projects);
export default defineConfig({
  testDir: testDir,
  timeout: config.timeout,
  retries: 0,
  reporter: [
    ['allure-playwright', {
      detail:false,
      environmentInfo: {
        "Automation Platform": env,
        os_platform: os.platform(),
        os_release: os.release(),
        os_version: os.version(),
        node_version: process.version,
        architecture: os.arch(),
        hostname: os.hostname(),
      }, executor: {
        name: 'Test Executor',  // Name of the test executor (could be a CI/CD system name or specific executor name)
        type: 'local',             // Type of executor, could be 'CI', 'local', etc.
        url: 'https://your-ci-system.com',  // Optional URL to your CI system (e.g., Jenkins, GitLab, etc.)
      }, outputFolder: 'allure-results'
    }],
  ],
  use: {
    baseURL:config.baseURL || 'https://amazon.com',
    headless: isHeadless,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

// Path to the global setup file
//globalSetup: './playwright/utilities/global-setup',
  
  projects: projects

});
