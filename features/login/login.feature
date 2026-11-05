@login @smoke @orangehrm
Feature: OrangeHRM Login
  As a user
  I want to login to OrangeHRM application
  So that I can access the dashboard

  Background:
    Given I am on the login page

  @positive @critical
  Scenario: Successful login with valid credentials
    When I enter username "Admin"
    And I enter password "[REDACTED_GENERIC_PASSWORD_1]"
    And I click the login button
    Then I should be redirected to the dashboard
    And login should be successful
    And the dashboard title should be "Dashboard"

  @positive
  Scenario: Login with valid credentials using login method
    When I login with username "Admin" and password "[REDACTED_GENERIC_PASSWORD_1]"
    Then login should be successful
    And I should be redirected to the dashboard

  @negative
  Scenario: Login with invalid username
    When I enter username "InvalidUser"
    And I enter password "[REDACTED_GENERIC_PASSWORD_1]"
    And I click the login button
    Then I should see error message
    And login should fail

  @negative
  Scenario: Login with invalid password
    When I enter username "Admin"
    And I enter password "wrongpassword"
    And I click the login button
    Then I should see error message
    And login should fail

  @negative
  Scenario: Login with empty credentials
    When I enter username ""
    And I enter password ""
    And I click the login button
    Then I should see error message

  @ui
  Scenario: Verify login page elements are present
    Then I should see the login page
    And element "input[name='username']" should be visible
    And element "input[name='password']" should be visible
    And element "button[type='submit']" should be visible
