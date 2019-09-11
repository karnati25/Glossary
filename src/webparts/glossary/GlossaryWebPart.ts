import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'GlossaryWebPartStrings';
import Glossary from './components/Glossary';
import { IGlossaryProps } from './components/IGlossaryProps';
import { sp, Items } from "@pnp/sp";

export interface IGlossaryWebPartProps {
  ListName: string;
  title :string;
}

export default class GlossaryWebPart extends BaseClientSideWebPart<IGlossaryWebPartProps> {

  public onInit(): Promise<void> {

    return super.onInit().then(_ => {
  
      // other init code may be present
  
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<IGlossaryProps > = React.createElement(
      Glossary,
      {
        ListName: this.properties.ListName,
        spfxContext: this.context,
        spHttpClient: this.context.spHttpClient,
        siteUrl: this.context.pageContext.web.absoluteUrl,
       // title:this.properties.title,
        //displayMode: this.displayMode,
        locale: this.getLocaleId()
        // onTitleUpdate: (newTitle: string) => {
        //    after updating the web part title in the component
        //    persist it in web part properties
        //   this.properties.title = newTitle;
          
        // }
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  protected getLocaleId() : string {
    return this.context.pageContext.cultureInfo.currentUICultureName;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('ListName', {
                  label: strings.ListNmeFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
