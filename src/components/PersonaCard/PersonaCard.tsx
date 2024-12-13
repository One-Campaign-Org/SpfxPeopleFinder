import * as React from 'react';
import { IPersonaCardProps } from './IPersonaCardProps';
import { IPersonaCardState } from './IPersonaCardState';
import {
  Persona,
  IPersonaSharedProps,
  ITheme,
  Stack
} from '@fluentui/react';
import { TemplateService } from '../../services/TemplateService/TemplateService';
import { isEmpty } from '@microsoft/sp-lodash-subset';


export class PersonaCard extends React.Component<IPersonaCardProps,IPersonaCardState> {
  private determinePersonaConfig(): IPersonaCardProps {
    let processedProps: IPersonaCardProps = this.props;

    if (this.props.fieldsConfiguration && this.props.item) {
        processedProps = TemplateService.processFieldsConfiguration<IPersonaCardProps>(this.props.fieldsConfiguration, this.props.item);
        //
        // the about me description is managed outside of this Graph to ProcessedProps mechanism so add it here
        processedProps.customAboutMeText = this.props.item.aboutMeDescription;
    }

    return processedProps;
  }

  /**
   *
   *
   * @private
   * @returns
   * @memberof PersonaCard
   */
  private _LivePersonaCard() { // eslint-disable-line @typescript-eslint/explicit-function-return-type
    const processedProps: IPersonaCardProps = this.determinePersonaConfig();

    return React.createElement(
      this.props.lpcLibrary.LivePersonaCard,
      {
        className: 'livePersonaCard',
        clientScenario: "PeopleWebPart",
        disableHover: false,
        hostAppPersonaInfo: {
          PersonaType: "User",
          PersonaAadObjectId: this.props.item.id,
          PersonaDisplayName: this.props.item.displayName
        },
        serviceScope: this.props.serviceScope,
        upn: this.props.item.userPrincipalName,
        email: this.props.item.mail,
        onCardOpen: () => {
          console.log('LivePersonaCard Open');
        },
        onCardClose: () => {
          console.log('LivePersonaCard Close');
        },
      },
      this._PersonaCard(processedProps)
    );
  }

  /**
   *
   *
   * @private
   * @returns {JSX.Element}
   * @memberof PersonaCard
   */
  private _PersonaCard(processedProps?: IPersonaCardProps): JSX.Element {

    if (isEmpty(processedProps)) {
      processedProps = this.determinePersonaConfig();
    }
    
    //optionalText: (processedProps.customAboutMeText !== undefined && processedProps.customAboutMeText.length > 0) ? processedProps.customAboutMeText : processedProps.optionalText,
    const persona: IPersonaSharedProps = {
      theme: this.props.themeVariant as ITheme,
      text: processedProps.text,
      secondaryText: processedProps.secondaryText,
      tertiaryText: processedProps.tertiaryText,
      optionalText: processedProps.optionalText,
      imageShouldFadeIn: false
    };

    if (!isEmpty(this.props.item.photoUrl)) {
      persona.imageUrl = this.props.item.photoUrl;
    }

    return (
      <Stack>
        <Persona {...persona} size={parseInt(this.props.personaSize)} />
        <div style={{marginTop: "1rem", marginLeft: "5.3rem"}}>
          {processedProps.customAboutMeText}
        </div>
      </Stack>
    )
  }

  /**
   *
   *
   * @returns {React.ReactElement<IPersonaCardProps>}
   * @memberof PersonaCard
   */
  public render(): React.ReactElement<IPersonaCardProps> {
    return (
      <>
        {!isEmpty(this.props.lpcLibrary) && this.props.showLPC
          ? this._LivePersonaCard()
          : this._PersonaCard()}
      </>
    );
  }
}
