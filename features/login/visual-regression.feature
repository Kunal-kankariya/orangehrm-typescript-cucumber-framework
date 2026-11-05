@visual @regression @orangehrm
Feature: Visual Regression Testing
  As a QA engineer
  I want to perform visual regression testing
  So that I can detect unintended UI changes

  Background:
    Given I am on the OrangeHRM login page

  @visual-login @smoke
  Scenario: Login page visual regression test
    Then the login page should match the baseline screenshot

  @visual-dashboard
  Scenario: Dashboard visual regression after login
    When I enter username "Admin"
    And I enter password "[REDACTED_GENERIC_PASSWORD_1]"
    And I click the login button
    Then I should see the dashboard
    And the dashboard should match the baseline screenshot

  @visual-element
  Scenario: Verify login form elements visually
    Then I should see no visual differences in ".oxd-form"
