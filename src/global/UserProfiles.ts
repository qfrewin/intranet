import { WebPartContext } from '@microsoft/sp-webpart-base';
import { User } from '@microsoft/microsoft-graph-types';

export interface IUserProperties {
  displayName: string;
  department: string;
  location: string;
  // Add more properties as needed
}

export async function getUserProperties(context: WebPartContext): Promise<IUserProperties> {
  const client = await context.msGraphClientFactory.getClient("3");
  const response: User = await client.api('/me')
  .select('displayName,department,officeLocation,country')
  .get();

  const location: string | undefined = response.country;

  const userProperties: IUserProperties = {
    displayName: response.displayName,
    department: response.department,
    location: location
  };

  return userProperties;
}
