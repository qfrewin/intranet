import {
    SPHttpClient
} from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface ListItem {
    [key: string]: any;
}

export class GetListItemsHelper {
    public async getListItems<T extends ListItem>(
        context: WebPartContext, 
        listName: string, 
        properties: string[],
        filters?: string[],
        orderBy?: string
        ): Promise<T[]> {
        let apiUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listName}')/items?$select=${properties.join(',')}`;

        if (filters && filters.length > 0) {
            const filterQuery = filters.join(' and ');
            apiUrl += `&$filter=${filterQuery}`;
        }

        if (orderBy) {
            apiUrl += `&$orderby=${orderBy}`
        }

        const response = await context.spHttpClient.get(
            apiUrl,
          SPHttpClient.configurations.v1);
          
          if (!response.ok) {
            const responseText = await response.text();
            throw new Error(responseText);
          }
    
          const responseJson = await response.json();
    
          return responseJson.value as T[];
      }
}