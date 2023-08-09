import { messageOutput } from '../PageLocator/locator.js';

export function checkOutput(page) {
    return page.locator(messageOutput).textContent() == 'Successfully registered the following information';
  }
