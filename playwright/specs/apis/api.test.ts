import { test, expect, request } from '@playwright/test';
import { ApiHelper } from '../../utilities/api-helper';
import { apiConfig } from '../../playwright.config';
import * as apiEndpoints from '../../../configs/api-endpoints.json';

test.describe('Api Test Suite', () => {
  let apiHelper: ApiHelper;
  let requestContext;
  let userId: string;

  test.beforeEach(async () => {
    requestContext = await request.newContext();
    apiHelper = new ApiHelper(apiConfig.baseURL);
  });

  test('GET API - Fetch a User with Query Params', async () => {
    //allure.logStep("Fetching User Details with "+requestContext);
    const response = await apiHelper.get(requestContext, apiEndpoints.endpoints.getUsers, { page: '2' });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.page).toEqual(2);
  });

  test('POST API - Create a User', async () => {
    const postData = {
      "name": "morpheus",
      "job": "leader"
  };
    const response = await apiHelper.post(requestContext, apiEndpoints.endpoints.createUser, postData);
    const user=await response.json();
    expect(response.status()).toBe(201);
    expect(user.name).toBe('morpheus');
    expect(user.job).toBe('leader');
    expect(user.id).not.toBeNull();
    userId = user.id;

  });

  test('PUT API - Update a User', async () => {
    const putData = {
      "name": "morpheus-updated",
      "job": "leader-updated"
  };
    const response = await apiHelper.put(requestContext, apiEndpoints.endpoints.updateUser.replace('{userId}',userId), putData);
    const updatedUser=await response.json();
    expect(response.status()).toBe(200);
    expect(updatedUser.name).toBe('morpheus-updated');
    expect(updatedUser.job).toBe('leader-updated');
    expect(updatedUser.updatedAt).not.toBeNull();
  });

  test('Delete API - Delete a User', async () => {
    
    const response = await apiHelper.delete(requestContext, apiEndpoints.endpoints.deleteUser.replace('{userId}',userId));
    expect(response.status()).toBe(204);
  });
});