import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';

// Function to get a person from a SharePoint list
const getAllItemsWithPersonField = (context: WebPartContext, listName: string, personFieldInternalName: string): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    const endpointUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listName}')/items`;

    // Make the GET request to retrieve all items in the list
    const httpClientOptions: any = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'GET'
      };
  
      const spHttpClient: SPHttpClient = context.spHttpClient;
  
      spHttpClient.fetch(endpointUrl, SPHttpClient.configurations.v1, httpClientOptions)
        .then((response: SPHttpClientResponse) => {
          if (response.ok) {
            response.json().then((responseJson: any) => {
              const items: any[] = responseJson.value;
              const personFieldValues: any[] = [];
  
              // Iterate through each item and retrieve the person field value
              items.forEach((item: any) => {
                const personField = item[personFieldInternalName];
                personFieldValues.push(personField);
              });
  
              resolve(personFieldValues);
            });
          } else {
            reject(`Error retrieving items: ${response.statusText}`);
          }
        })
        .catch((error: any) => {
          reject(`Error retrieving items: ${error}`);
        });
    });
  };
  
  export default getAllItemsWithPersonField;
