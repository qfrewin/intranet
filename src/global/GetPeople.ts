import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IUserProperties {
  displayName: string;
  department: string;
  location: string;
  // Add more properties as needed
}

export async function getPeople(context: WebPartContext): Promise<string> {
  const client = await context.msGraphClientFactory.getClient("3");
  const response: string = await client.api('/me/people')
  .get();

  return JSON.stringify(response);
}
