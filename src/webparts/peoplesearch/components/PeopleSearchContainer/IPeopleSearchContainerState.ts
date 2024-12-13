import { ExtendedUser } from '../../../../models/ExtendedUser';
import { PageCollection } from '../../../../models/PageCollection';

// used to recieve colleague details from the Sharepoint list used to manage the Colleague Finder about me details
export interface ISharepointColleagueListItem {
  Title: string;
  AboutMe?: string;
}

// like above, but allows us to pass data around the web-part disassociated from the Sharepoint naming convension (I.e., title)
export interface IColleagueAboutMe {
  emailAddress: string; 
  aboutMeText?: string;
}

export interface IPeopleSearchContainerState {
  results: PageCollection<ExtendedUser>[];
  resultCount: number;
  areResultsLoading: boolean;
  errorMessage: string;
  hasError: boolean;
  page: number;
  searchParameter: string;
  isReset: boolean;
  colleagueAboutMe?: IColleagueAboutMe[];
}
