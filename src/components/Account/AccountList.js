import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listAccountReadModels } from "../../graphql/queries.js";
import AccountSummary from "./AccountSummary";
import "./AccountList.css";

class AccountList extends Component {
  state = {
    userId: this.props.userId,
    accounts: [], // list of accounts owned by the userId,
    isLoading: false
  };

  componentDidMount = async () => {
    this.setState({ isLoading: !this.state.isLoading });

    // TODO Write a new query to get list of accounts by user id instead of filtering after
    await API.graphql(
      graphqlOperation(listAccountReadModels, {
        limit: 50,
        filter: {
          userId: {
            eq: this.state.userId
          }
        }
      })
    ).then(result =>
      this.setState({
        accounts: result.data.listAccountReadModels.items.sort((a, b) =>
          a.createdDate < b.createdDate ? 1 : -1
        )
      })
    );

    this.setState({ isLoading: !this.state.isLoading });
  };

  handleDisplayAccount = account => {
    this.props.onDisplayAccount(account);
  };

  render() {
    return (
      <>
        {this.state.isLoading ? (
          <div className="ui active centered inline loader"></div>
        ) : (
          <div className="ui divided selection list">
            {this.state.accounts.map(account => {
              return (
                <div
                  className="item"
                  key={account.aggregateId}
                  data-test="account-label"
                  onClick={() => this.handleDisplayAccount(account)}
                >
                  <AccountSummary account={account} />
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  }
}

export default AccountList;
