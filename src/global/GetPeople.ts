import { WebPartContext } from '@microsoft/sp-webpart-base';
import { User } from '@microsoft/microsoft-graph-types';
//import * as XLSX from 'xlsx';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
//import { SPHttpClient } from '@microsoft/sp-http';

export async function getPeople(context: WebPartContext): Promise<string> {
    try {
        const users: User[] = [];
        const client = await context.msGraphClientFactory.getClient("3");
        let nextLink = `/users`;
    
        do {
            const response: { value: User[], '@odata.nextLink'?: string } = await client.api(nextLink)
                .select('photo')
                .get();
            const receivedUsers: User[] = response.value;
            users.push(...receivedUsers);
            nextLink = response['@odata.nextLink'];
        } while (nextLink);
    
        return await JSON.stringify(users);
    } catch (error) {
        throw new Error(error);
    }
}

export async function getSheetData(context: WebPartContext): Promise<any[][]> {
    try {
      const graphClient = await context.msGraphClientFactory.getClient("3");
  
      const response = await graphClient
        .api(`/sites/{site-id}/drive/items/{item-id}/workbook/worksheets/{sheet-name}/usedRange`)
        .version('v1.0')
        .get();
  
      const sheetData = response.values;
  
      return sheetData;
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function getExcelFilePath(context: WebPartContext, fileName: string): Promise<string> {
    try {
      const listTitle = 'TestLibrary'; // Replace with the title of your document library
      const endpoint = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listTitle}')/Files?$filter=Name eq '${fileName}'&$select=ServerRelativeUrl`;
    
      const response: SPHttpClientResponse = await context.spHttpClient.get(endpoint, SPHttpClient.configurations.v1);
      const data = await response.json();
    
      //const file = data.value[0];
      //const serverRelativeUrl = file.ServerRelativeUrl;
      //const fileUrl = `${context.pageContext.web.absoluteUrl}${serverRelativeUrl}`;
    
      return JSON.stringify(data)//fileUrl;
    } catch (error) {
      throw new Error(error);
    }
  }

// export async function getPeople(context: WebPartContext): Promise<string> {
//     try {
//         const client = await context.msGraphClientFactory.getClient("3");
//         const response: User = await client.api("/me")
//         .select('displayName,birthday,officeLocation,country,photo')
//         .get();

//         return JSON.stringify(response);
//     } catch (error) {
//         throw new Error(error);
//     }
// }
