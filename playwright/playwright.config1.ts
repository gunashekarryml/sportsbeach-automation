import { defineConfig, devices } from '@playwright/test';
import * as configs from '../configs/playwrightConfig.json'; // Import configuration from an external JSON file
import * as os from "node:os"; // Import OS module to retrieve system information
import dotenv from 'dotenv';


dotenv.config();
// Get the environment variable for the testing environment (default to 'qa' if not provided)
const env = process.env.ENV || 'qa';
const runMode = process.env.RUN_MODE || 'local';
var platform='WEB';
// Get the project configuration from environment variables
const projectConfig = process.env.PROJECT;
// Retrieve environment-specific configurations from the JSON file
const config = configs[env];
// Default test directory (for web tests)
var testDir = '../playwright/specs/web';

// Default directory for Allure reports (for web tests)
var reportOutputDir = './playwright/reports/web/allure-results';

console.log("TIMEOUT FROM CONFIG FILE: ", config.timeout);

// Array to hold the selected Playwright project configuration
var projects: any = []=[];

// Determine whether to run tests in headless mode (default to `true` if not defined)
var isHeadless = process.env.HEADLESS === 'true' ?true: configs.headless

console.log("PROJECT CONFIG: ", projectConfig);

// Determine if mobile mode should be enabled (read from environment variable or `playwrightConfig.json`)
// const isMobileMode = process.env.MOBILE_MODE === 'true' ? true : configs.mobileMode;

// Get the selected mobile device name (from environment variable or `playwrightConfig.json`, default to 'Desktop')
// const selectedDevice = process.env.DEVICE_NAME || configs.device || 'Desktop';

// console.log("MOBILE MODE: ", isMobileMode);
// if (isMobileMode) console.log("SELECTED MOBILE DEVICE FOR EMULATION: ", selectedDevice);

// Apply Playwright's predefined device configuration if mobile mode is enabled
// const deviceConfig = isMobileMode && devices[selectedDevice] ? devices[selectedDevice] : {};

// Assign appropriate browser-specific project configurations based on `PROJECT` environment variable
if (projectConfig === 'chrome') {
  projects = configs.testChrome;
} else if (projectConfig === 'firefox') {
  projects = configs.testFirefox;
} else if (projectConfig === 'webkit') {
  projects = configs.testSafari;
} else if (projectConfig === 'edge') {
  projects = configs.testEdge;
} else if (projectConfig === 'all') {
  projects = configs.testAllBrowsers;
} else if (projectConfig === 'api') {
  // If testing APIs, set the test directory and allure report path for API tests
  platform="API";
  projects = configs.testApi;
  testDir = './tests/apis/';
  reportOutputDir = './playwright/reports/api/allure-results';
} else {
  // Default to Chromium if no specific browser is provided
  projects = [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    }
  ];
}

const reportTitle="Automation Report for "+platform;

// Function to determine the correct Allure results folder dynamically
const getAllureResultsFolder = () => {
  return projectConfig === 'api' ? './playwright/reports/api/allure-results' : './playwright/reports/web/allure-results';
};

// API configuration (for API testing scenarios)
export const apiConfig = {
  baseURL: config.backendHostingUrl,
  authToken: 'sample' // Example token (update this dynamically for real use cases)
};

// User credentials configuration (useful for login-based tests)
export const user = {
  username: config.userName,
  password: config.password,
};

console.log("PROJECT CONFIG VALUE: ", projects);
console.log("Report Dir: ", reportOutputDir);
if(runMode === 'BROWSERSTACK'){

  const updatedArray= projects.map(project => ({
    // Add the new field to the 'details' object
      ...project,
      use: {
        ...project.use,
        connectOptions: {
            wsEndpoint: `wss://ondemand.us-west-1.saucelabs.com/playwright?username=${process.env.SAUCE_USERNAME}&accessKey=${process.env.SAUCE_ACCESS_KEY}`,
          } // Adding the new field to the child object
      }
    }));
    projects=updatedArray;
    console.log("PROJECT BEFORE MAP "+JSON.stringify(projects));
    //projects=mapToBrowserStackSettings(projects);
    //console.log("BS PROJECT "+projects);
}

// Define Playwright's global configuration
export default defineConfig({
  // Specify the directory containing test files
  testDir: testDir,

  // Global test timeout (in milliseconds)
  timeout: config.timeout,

  // Number of times a test will be retried before failing (set to 0 for no retries)
  retries: 0,

  // Set the number of parallel workers based on `playwrightConfig.json`
  //workers: 2,//configs.workers,
  // Configure the test report format (Allure Report)
  reporter: [
    ['allure-playwright', {
      resultsDir: getAllureResultsFolder(), // Dynamically determine results folder
      detail: false, // Disable detailed reporting for a cleaner report
      suiteTitle: true, // Enable suite titles for better report organization
      environmentInfo: {
        "Automation Platform": platform, // Test execution environment (e.g., dev, qa, prod)
        "Test Environment": env,
        os_platform: os.platform(), // OS name (Windows/Linux/macOS)
        os_release: os.release(), // OS version
        os_version: os.version(), // OS detailed version
        node_version: process.version, // Node.js version used for execution
        architecture: os.arch(), // System architecture (x64, arm, etc.)
        hostname: os.hostname(), // Machine hostname
      },
      executor: {
        name: 'Test Executor', // Name of the executor (useful for CI/CD identification)
        type: 'local', // Execution type (e.g., local, CI, containerized)
        url: 'https://your-ci-system.com', // CI/CD system URL (for linking reports)
      },
    }],
  ],

  // Playwright `use` configurations (shared settings for all tests)
  use: {
    baseURL: config.baseURL || 'https://amazon.com', // Set base URL dynamically
    headless: isHeadless, // Run tests in headless mode if enabled
    // ...deviceConfig,  // Apply mobile device emulation settings if applicable
    screenshot: 'only-on-failure', // Capture screenshots only on test failures
    video: 'retain-on-failure', // Record videos for failed test cases
  },

  // Global teardown file (executed after all tests complete)
  globalTeardown: '../configs/allure-teardown.ts',

  // Uncomment and use if a global setup script is needed before test execution
  // globalSetup: './playwright/utilities/global-setup',

  // Define the projects (browsers/devices) to run tests on
  projects: projects
});