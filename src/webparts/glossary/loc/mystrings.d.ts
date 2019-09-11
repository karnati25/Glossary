declare interface IGlossaryWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  ListNmeFieldLabel: string;
  SearchButtonText: string;
  LoadingSpinnerLabel: string;
  NoPeopleFoundLabel: string;
  SearchBoxPlaceholder: string;
  ErrorLabel: string;
}

declare module 'GlossaryWebPartStrings' {
  const strings: IGlossaryWebPartStrings;
  export = strings;
}
