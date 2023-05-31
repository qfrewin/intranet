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
  //.select('displayName,department,officeLocation,country,businessPhone')
  .get();

  let location: string | undefined = response.officeLocation; // Use officeLocation initially

  if (!location) { // If officeLocation is null or undefined
    location = response.country; // Fallback to country if available
  }

  const userProperties: IUserProperties = {
    displayName: response.displayName,
    department: JSON.stringify(response),
    location: location
  };

  return userProperties;
}
