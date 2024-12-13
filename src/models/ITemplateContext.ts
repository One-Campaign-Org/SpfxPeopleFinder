import { PageCollection } from './PageCollection';
import { IComponentFieldsConfiguration } from '../services/TemplateService/TemplateService';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { ServiceScope } from '@microsoft/sp-core-library';
import { ExtendedUser } from './ExtendedUser';
import { IColleagueAboutMe } from '../webparts/peoplesearch/components/PeopleSearchContainer/IPeopleSearchContainerState';

interface ITemplateContext {
    items: PageCollection<ExtendedUser>;
    resultCount: number;
    showResultsCount: boolean;
    showBlank: boolean;
    showPagination: boolean;
    showLPC: boolean;
    peopleFields?: IComponentFieldsConfiguration[];
    themeVariant?: IReadonlyTheme;
    serviceScope: ServiceScope;
    colleagueAboutMe?: IColleagueAboutMe[],
    [key:string]: IComponentFieldsConfiguration[] | number | boolean | PageCollection<ExtendedUser> | IReadonlyTheme | ServiceScope | IColleagueAboutMe[];
}

export default ITemplateContext;