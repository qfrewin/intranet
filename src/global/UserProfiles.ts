import { WebPartContext } from '@microsoft/sp-webpart-base';
import { User } from '@microsoft/microsoft-graph-types';

export interface IUserProperties {
  displayName: string;
  location: string;
}

export async function getUserProperties(context: WebPartContext): Promise<IUserProperties> {
  const client = await context.msGraphClientFactory.getClient("3");
  const response: User = await client.api('/me')
  .select('displayName,country')
  .get();

  let location = response.country;

  const userProperties: IUserProperties = {
    displayName: response.displayName,
    location: location
  };

  return userProperties;
}
