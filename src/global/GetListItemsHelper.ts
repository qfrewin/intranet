import { WebPartContext } from '@microsoft/sp-webpart-base';

import { SPFx, spfi } from "@pnp/sp";
import '@pnp/sp/webs'
import '@pnp/sp/lists';
import '@pnp/sp/items';

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
            const sp = spfi().using(SPFx(context));
            return await sp.web.lists.getByTitle(listName).items();
    }
}