import * as React from "react";

import * as strings from "PeopleSearchWebPartStrings";
import styles from "../PeopleSearchWebPart.module.scss";

import { IPeopleSearchBoxProps } from "./IPeopleSearchBoxProps";
import { IPeopleSearchBoxState } from "./IPeopleSearchBoxState";

import {
  IconButton,
  SearchBox,
  ITheme
} from '@fluentui/react';

export class PeopleSearchBox extends React.Component<IPeopleSearchBoxProps,IPeopleSearchBoxState> {

  public constructor(props: IPeopleSearchBoxProps) {

    super(props);

    this.state = {
        searchInputValue: props.searchInputValue,
        showClearButton: false,
    };
  }

  private renderBasicSearchBox(): JSX.Element {
      return (
          <div className={styles.searchBoxWrapper}>
              <SearchBox
                  placeholder={strings.SearchInputPlaceholder}
                  theme={this.props.themeVariant as ITheme}
                  className={styles.searchTextField}
                  value={this.state.searchInputValue}
                  autoComplete="off"
                  onChange={(event, value) => this.setState({ searchInputValue: value })}
                  onSearch={() => this._onSearch(this.state.searchInputValue)}
                  onClear={() => this._onSearch('', true)}
              />
              <div className={styles.searchButton}>
                  {this.state.searchInputValue &&
                      <IconButton
                          onClick={() => this._onSearch(this.state.searchInputValue)}
                          iconProps={{ iconName: 'Forward' }}
                      />
                  }
              </div>
          </div>
      );
  }

  /**
   * Handler when a user enters new keywords
   * @param queryText The query text entered by the user
   */
  public async _onSearch(queryText: string, isReset: boolean = false): Promise<void> {

      // Don't send empty value
      if (queryText || isReset) {

          const query = queryText;

          this.setState({
              searchInputValue: queryText,
              showClearButton: !isReset
          });

          const element = document.activeElement as HTMLElement;
          if (element) {
              element.blur();
          }

          // Notify the dynamic data controller
          await this.props.onSearch(query, isReset);
      }
  }

  public render(): React.ReactElement<IPeopleSearchBoxProps> {
      return (
          <div className={styles.searchBox}>
              {this.renderBasicSearchBox()}
          </div>
      );
  }
}
