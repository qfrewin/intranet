import * as React from 'react';
import * as ReactDom from 'react-dom';

import {
  IPropertyPaneConfiguration,
  PropertyPaneSlider,
  PropertyPaneDropdown,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';

//import * as strings from 'QuickLinksWebPartStrings';
import QuickLinks from './components/QuickLinks';
import { ISPList } from './components/ISPLists';

import { IQuickLinksProps } from './components/IQuickLinksProps';
import { colors } from '../../global/colors';
import { GetListItemsHelper } from './../../global/GetListItemsHelper';

export interface IQuickLinksWebPartProps {
  numColumns: number;
  backgroundColor: string;
  textColor: string;
}

export default class QuickLinksWebPart extends BaseClientSideWebPart<IQuickLinksWebPartProps> {
  private items: ISPList[] = [];

  protected async onPropertyPaneConfigurationStart(): Promise<void> {
    // Set default values for properties
    this.properties.numColumns = this.properties.numColumns || 4;
    this.properties.backgroundColor = this.properties.backgroundColor || "white";
    this.properties.textColor = this.properties.textColor || "black";
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    // get quick links
    await this._getListItems();

    // render
    //this.render();
  }

  public render(): void {

    const element: React.ReactElement<IQuickLinksProps> = React.createElement(
      QuickLinks,
      {
        numColumns: this.properties.numColumns,
        items: this.items,
        backgroundColor: this.properties.backgroundColor,
        textColor: this.properties.textColor
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private async _getListItems(): Promise<ISPList[]> {
    const context: WebPartContext = this.context;
    const helper: GetListItemsHelper = new GetListItemsHelper();
    const listName = "QuickLinks";
    const properties: string[] = ['Title', 'URL', 'ID'];

    const listItems: ISPList[] = await helper.getListItems<ISPList>(context, listName, properties, null, null);
    this.items = listItems;
    return listItems;
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected onAfterPropertyPaneChangesApplied(): void {
    this.render()
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupName: "Grid",
              groupFields: [
                PropertyPaneSlider('numColumns', {
                  label: "Number of Columns",
                  min: 1,
                  max: 6,
                  value: 4,
                  showValue: true,
                  step: 1
                }),
                PropertyPaneDropdown('backgroundColor', {
                  label: 'Background Color',
                  options: colors.map(color => ({
                    key: color.value,
                    text: color.name
                  })),
                  selectedKey: "blue"  
                }),
                PropertyPaneDropdown('textColor', {
                  label: 'Text Color',
                  options: colors.map(color => ({
                    key: color.value,
                    text: color.name
                  })),
                  selectedKey: "black" 
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
