import { WebPartContext } from "@microsoft/sp-webpart-base";
import { spfi, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

interface ListItem {
    Title: string,
    URL: string
}

export class ExcelReader {
    public async readDataFromExcel(context: WebPartContext): Promise<ListItem[]> {
        const sp = spfi().using(SPFx(context));
        return await sp.web.lists.getByTitle('QuickLinks').items();
    }
}