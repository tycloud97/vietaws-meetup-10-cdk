import { useState, useContext, useEffect } from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Formik } from 'formik';
import { Form, Input, SubmitButton, Select } from 'formik-semantic-ui-react';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

import { UserContext } from '../Auth/User';
import Loading from '../../components/Loading';

type SelectList = {
  key: string;
  text: string;
  value: string;
};

const GET_ACCOUNT_BY_AGGREGATE_ID = gql`
  query GetAccountByAggregateId($aggregateId: ID!) {
    getAccountByAggregateId(aggregateId: $aggregateId) {
      id
      aggregateId
      name
      description
      version
      bookValue
      marketValue
      accountType {
        id
        name
        description
      }
    }
  }
`;

const LIST_ACCOUNT_TYPES = gql`
  query ListAccountTypes {
    listAccountTypes {
      id
      name
      description
    }
  }
`;

const CREATE_ACCOUNT = gql`
  mutation CreateAccount($createAccountInput: CreateEventInput!) {
    createEvent(event: $createAccountInput) {
      id
      aggregateId
      name
      version
      data
      userId
      createdAt
    }
  }
`;

const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($updateAccountInput: CreateEventInput!) {
    createEvent(event: $updateAccountInput) {
      aggregateId
      name
      version
      data
      userId
      createdAt
    }
  }
`;

const AccountForm = (props: any) => {
  const [aggregateId] = useState(props.match.params.id !== undefined ? props.match.params.id : '');
  const [username, setUsername] = useState('');

  const { data: accountTypes, error: accountTypesError, loading: accountTypesLoading } = useQuery(LIST_ACCOUNT_TYPES);
  const {
    data: account,
    error: accountError,
    loading: accountLoading,
  } = useQuery(GET_ACCOUNT_BY_AGGREGATE_ID, { variables: { aggregateId: aggregateId } });

  const [createAccountMutation] = useMutation(CREATE_ACCOUNT);
  const [updateAccountMutation] = useMutation(UPDATE_ACCOUNT);

  const { getSession } = useContext(UserContext);

  useEffect(() => {
    aggregateId
      ? console.log(`[ACCOUNT FORM] Aggregate Id ${aggregateId} exists. Edit Account mode enabled`)
      : console.log('[ACCOUNT FORM] Aggregate Id does not exist.  Create Account mode enabled');

    // Get the logged in username
    getSession().then((session: any) => {
      setUsername(session.idToken.payload.email);
    });
  }, [aggregateId, getSession]);

  if (accountTypesError || accountError) return 'Error!'; // You probably want to do more here!
  if (accountTypesLoading || accountLoading) return <Loading />;

  const accountTypesList: SelectList[] = [];
  accountTypes.listAccountTypes.map((d: any) => {
    accountTypesList.push({ key: d.id, text: d.name, value: d.description });
    return true;
  });

  const createUpdateAccount = (name: string, accountType: string, description: string) => {
    const selectedAccountType: SelectList = accountTypesList.find((a) => a.value === accountType) ?? {
      key: '',
      text: '',
      value: '',
    };

    if (!props.match.params.id) {
      console.log('[ACCOUNT FORM] Creating Account...');

      const params = {
        createAccountInput: {
          aggregateId: uuidv4(),
          name: 'AccountCreatedEvent',
          data: `{"name":"${name}","description":"${description}","bookValue":0,"marketValue":0,"accountType":{"id":"${selectedAccountType.key}","name":"${selectedAccountType.text}","description":"${selectedAccountType.value}"}}`,
          version: 1,
          userId: `${username}`,
          createdAt: new Date(),
        },
      };

      createAccountMutation({
        variables: params,
      })
        .then((res) => {
          console.log('[ACCOUNT FORM] Account created successfully');

          setTimeout(() => {
            window.location.pathname = '/accounts';
          }, 1000);
        })
        .catch((err) => {
          console.error('[ACCOUNT FORM] Error occurred creating account');
          console.error(err);
        });
    } else {
      console.log('[ACCOUNT FORM] Updating Account...');

      const params = {
        updateAccountInput: {
          aggregateId: account.getAccountByAggregateId.aggregateId,
          name: 'AccountUpdatedEvent',
          data: `{"id":"${account.getAccountByAggregateId.id}","name":"${name}","description":"${description}","bookValue":${account.getAccountByAggregateId.bookValue},"marketValue":${account.getAccountByAggregateId.marketValue},"accountType":{"id":"${selectedAccountType.key}","name":"${selectedAccountType.text}","description":"${selectedAccountType.value}"}}`,
          version: account.getAccountByAggregateId.version + 1,
          userId: `${username}`,
          createdAt: new Date(),
        },
      };

      console.log('[ACCOUNT FORM] Updaing Account with values: ', params);

      updateAccountMutation({
        variables: params,
      })
        .then((res) => {
          console.log('[ACCOUNT FORM] Account updated successfully');

          window.location.pathname = '/accounts';
        })
        .catch((err) => {
          console.error('[ACCOUNT FORM] Error occurred updating account');
          console.error(err);
        });
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <h2>Account</h2>
        <Segment>
          <Header sub color='teal' content='Account Details' />
          <Formik
            initialValues={{ name: '', accountType: '', description: '' }}
            onSubmit={(values, actions) => {
              createUpdateAccount(values.name, values.accountType, values.description);
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required('Please enter an Account name'),
              accountType: Yup.string().required('Please select an Account type'),
              description: Yup.string().required('Please enter an Account description'),
            })}
          >
            <Form size='large'>
              <Input
                id='name'
                fluid
                icon='user'
                iconPosition='left'
                name='name'
                label='Account name'
                placeholder='Account name'
                errorPrompt
              />
              <Select
                id='accountType'
                name='accountType'
                label='Account Type'
                options={accountTypesList}
                placeholder='Select an account type'
                selection
                errorPrompt
              />
              <Input
                id='description'
                fluid
                icon='lock'
                iconPosition='left'
                name='description'
                label='Account description'
                placeholder='Account description'
                errorPrompt
              />
              <SubmitButton fluid primary>
                Submit
              </SubmitButton>
            </Form>
          </Formik>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default AccountForm;
