import {IListItems} from './IListItems';

export interface IGlossaryState{  
  //status: string;  
  items: IListItems[];  
  loading: boolean;
  initialContainer: any[];
    /**
     * Contains the error message that occurred while loading the data.
     * If no error message occurred, null.
     */
    errorMessage: string;
    /**
     * Currently selected tab, eg. 'A'
     */
    selectedIndex: string;
    /**
     * Current search query. Empty string if no search query has been issued
     */
   // searchQuery: string;
  
} 