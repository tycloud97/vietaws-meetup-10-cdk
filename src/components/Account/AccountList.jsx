import React, { Component } from "react";
import { connect } from "react-redux";
import LoadingComponent from "../App/LoadingComponent";
import AccountSummary from "./AccountSummary";
import { fetchAccounts } from "./accountActions";
import "./AccountList.css";

class AccountList extends Component {
  componentDidMount = async () => {
    console.log("AccountList");
    this.props.fetchAccounts();
  };

  render() {
    const { loading, accounts } = this.props;

    if (loading) return <LoadingComponent />;

    return (
      <>
        <div>Accounts</div>
        <div className='ui divided selection list'>
          {accounts.map(account => {
            return (
              <div
                className='item'
                key={account.aggregateId}
                data-test='account-label'
                onClick={() => this.handleDisplayAccount(account)}
              >
                <AccountSummary account={account} />
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    loading: state.async.loading,
    accounts: state.accounts.accounts
  };
};

export default connect(mapStateToProps, { fetchAccounts })(AccountList);
