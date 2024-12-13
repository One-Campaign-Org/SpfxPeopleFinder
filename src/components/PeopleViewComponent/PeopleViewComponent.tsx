import * as React from 'react';
import ITemplateContext from '../../models/ITemplateContext';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { PersonaCard } from '../PersonaCard/PersonaCard';
import styles from './PeopleViewComponent.module.scss';
import { Text } from '@microsoft/sp-core-library';
import * as strings from "PeopleSearchWebPartStrings";
import {
    Log, Environment, EnvironmentType,
  } from '@microsoft/sp-core-library';
  import { SPComponentLoader } from '@microsoft/sp-loader';
import { IColleagueAboutMe } from '../../webparts/peoplesearch/components/PeopleSearchContainer/IPeopleSearchContainerState';
import { ExtendedUser } from '../../models/ExtendedUser';

const LIVE_PERSONA_COMPONENT_ID: string = "914330ee-2df2-4f6e-a858-30c23a812408";

export interface IPeopleViewProps {
    templateContext: ITemplateContext;
}

export interface IPeopleViewState {
    isComponentLoaded: boolean;
}

export class PeopleViewComponent extends React.Component<IPeopleViewProps, IPeopleViewState> {
    private sharedLibrary: any; // eslint-disable-line @typescript-eslint/no-explicit-any

    constructor(props: IPeopleViewProps) {
      super(props);
  
      this.state = {
        isComponentLoaded: false,
      };
  
      this.sharedLibrary = null;

      if (Environment.type !== EnvironmentType.Local && this.props.templateContext.showLPC) {
        this._loadSpfxSharedLibrary(); // eslint-disable-line @typescript-eslint/no-floating-promises
      }

/*      this.props.templateContext.colleagueAboutMe.map((item: IColleagueAboutMe) => {
            console.log(`Cons Item: ${item.emailAddress} Value: ${item.aboutMeText}`);
        }); */
    }

    private async _loadSpfxSharedLibrary(): Promise<void> {
      if (!this.state.isComponentLoaded) {
          try {
              this.sharedLibrary = await SPComponentLoader.loadComponentById(LIVE_PERSONA_COMPONENT_ID);   
  
              this.setState({
                  isComponentLoaded: true
              });
  
          } catch (error) {
             Log.error(`[LivePersona_Component]`, error, this.props.templateContext.serviceScope);
          }
      }        
    }

    private _getAboutMeDescription(userPrincipalName: string, colleagueAboutMe: IColleagueAboutMe[]): string {
        if(colleagueAboutMe !== undefined && userPrincipalName !== undefined) {
            const resultList: IColleagueAboutMe[] = colleagueAboutMe.filter((value: IColleagueAboutMe) => {
                if (value.emailAddress === userPrincipalName) {
                    return value;
                }
            });
            return (resultList.length > 0) ? (resultList[0].aboutMeText !== undefined) ? resultList[0].aboutMeText : "" : "";
        }
        return "";
    }

    public render(): JSX.Element {
        const ctx = this.props.templateContext;
        let mainElement: JSX.Element = null;
        let resultCountElement: JSX.Element = null;
        let paginationElement: JSX.Element = null;

        if (!isEmpty(ctx.items) && !isEmpty(ctx.items.value)) {
            if (ctx.showResultsCount) {
                resultCountElement = <div className={styles.resultCount}>
                        <label className="ms-fontWeight-semibold">{Text.format(strings.ResultsCount, ctx.resultCount)}</label>
                    </div>;
            }

            if (ctx.showPagination) {
                paginationElement = null;
            }
            /*
            ctx.colleagueAboutMe.map((item: IColleagueAboutMe) => {
                console.log(`Item: ${item.emailAddress} Value: ${item.aboutMeText}`);
            });
            */
            const personaCards = [];
            for (let i = 0; i < ctx.items.value.length; i++) {
                //
                const personDetail: ExtendedUser = {
                    ...ctx.items.value[i],
                    aboutMeDescription: this._getAboutMeDescription(ctx.items.value[i].userPrincipalName, ctx.colleagueAboutMe)
                } 

                //console.log(`User: ${personDetail.userPrincipalName} About: ${personDetail.aboutMeDescription}`);

                //console.log(JSON.stringify(personDetail));

                //
                personaCards.push(<div className={styles.documentCardItem} key={i}>
                    <div className={styles.personaCard}>
                        <PersonaCard serviceScope={ctx.serviceScope} fieldsConfiguration={ctx.peopleFields} item={personDetail} 
                            themeVariant={ctx.themeVariant} personaSize={ctx.personaSize as string} showLPC={ctx.showLPC} lpcLibrary={this.sharedLibrary} />
                    </div>
                </div>);
            }

            mainElement = <React.Fragment>
                <div className={styles.defaultCard}>
                    {resultCountElement}
                    <div className={styles.documentCardContainer}>
                        {personaCards}
                    </div>
                </div>
                {paginationElement}
            </React.Fragment>;
        }
        else if (!ctx.showBlank) {
            mainElement = <div className={styles.noResults}>{strings.NoResultMessage}</div>;
        }

        return <div className={styles.peopleView}>{mainElement}</div>;
    }
}