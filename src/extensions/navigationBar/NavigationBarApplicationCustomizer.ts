import { override } from '@microsoft/decorators';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import NavigationBar from './components/NavigationBar';
import { ListItem } from './components/NavigationBar';

export default class HelloWorldApplicationCustomizer extends BaseApplicationCustomizer<{}> {
  private _topPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);

    return Promise.resolve();
  }

  private async _renderPlaceHolders(): Promise<void> {
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );

      if (this._topPlaceholder) {
        const links = await this._getLinksFromList();

        const element: React.ReactElement = React.createElement(
          NavigationBar,
          { links }
        );

        ReactDom.render(element, this._topPlaceholder.domElement);
      }
    }
  }

  private _onDispose(): void {
    ReactDom.unmountComponentAtNode(this._topPlaceholder?.domElement);
  }

  private async _getLinksFromList(): Promise<ListItem[]> {
    const listName = 'GlobalNavigation';
    const url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listName}')/items?$select=Title,URL,Order,Parent`;
  
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json;odata=nometadata',
        'Content-Type': 'application/json;odata=nometadata',
        'Cache-Control': 'no-cache',
      },
    });
  
    if (response.ok) {
      const data = await response.json();
      const items: ListItem[] = data.value.map((item: any) => {
        return {
          Title: item.Title,
          URL: item.URL,
          Order: item.Order,
          Parent: item.Parent,
        };
      });
      return items;
    } else {
      throw new Error(`Error retrieving list items: ${response.statusText}`);
    }
  }
}
