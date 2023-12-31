import {
  firstNameInput,
  lastNameInput,
  phoneNumberInput,
  countryInput,
  emailInput,
  passwordInput,
  registerInput,
} from "../PageLocator/locator.js";
import { check } from 'k6';
import { checkOutput } from '../Assertion/assertion.js';

export async function performTextBox(page) {
  await page.locator(firstNameInput).type("Fajri");
  await page.locator(lastNameInput).type("Tsani");
  await page.locator(phoneNumberInput).type("0808080808");
  await page.selectOption(countryInput, "Indonesia");
  await page.locator(emailInput).type("fajri@gmail.com");
  await page.locator(passwordInput).type("password");
  await page.locator(registerInput).click();
  check(page, {
    'Message Registration Assertion': checkOutput(page),
  });
}
