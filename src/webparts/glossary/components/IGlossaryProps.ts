import {
  IWebPartContext
} from '@microsoft/sp-webpart-base'; 
import { SPHttpClient } from '@microsoft/sp-http';
//import { DisplayMode } from "@microsoft/sp-core-library";
import { IListItems } from './IListItems';
export interface IGlossaryProps {
ListName: string;
spfxContext: IWebPartContext;
spHttpClient: SPHttpClient;
siteUrl: string;
//title: string;
//items : IListItems;
/**
 * Current page display mode. Used to determine if the user should
 * be able to edit the page title or not.
 */
//displayMode: DisplayMode;
 /**
 * Current locale
 */
locale: string;
/**
 * Event handler for changing the web part title
 */
//onTitleUpdate: (newTitle: string) => void;

}



