# k6 Load Testing Script

This repository contains a k6 load testing script that can be configured for different testing scenarios using the `config.js` file. You can also customize the testing method using command-line arguments when running the script.

## Configuration

To set the configuration for the host and endpoints, you can modify the `config.js` file. This file contains different configurations for various testing methods such as 'average', 'breakpoint', 'smoke', 'soak', 'spike', and 'stress'. Each configuration includes the necessary parameters for the load testing scenarios.

Modify the `config.js` file to suit your testing requirements.

## Running the Script

To run the k6 script, follow these steps:

1. Open a terminal window.

2. Navigate to the directory where the `main_test.js` file is located.

3. Use the following command to run the script, replacing `<METHOD>` with the desired testing method:
   ```sh
   k6 run main_test.js --env METHOD=<METHOD>
