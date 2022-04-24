export type CreateTransactionInput = {
  createTransactionInput: {
    userId: string;
    aggregateId: string;
    type: string;
    transactionDate: string;
    symbol: string;
    shares: number;
    price: number;
    commission: number;
  };
};

export type UpdateTransactionInput = {
  updateTransactionInput: {
    userId: string;
    createdAt: string;
    aggregateId: string;
    type: string;
    transactionDate: string;
    symbol: string;
    shares: number;
    price: number;
    commission: number;
  };
};

export type DeleteTransactionInput = {
  deleteTransactionInput: {
    userId: string;
    createdAt: string;
    aggregateId: string;
    symbol: string;
  };
};

export type TransactionsProps = {
  transactions: [TransactionReadModel];
};

export type TransactionProps = {
  location: {
    state: {
      transaction: TransactionReadModel;
    };
  };
};

export type TransactionReadModel = {
  userId: string;
  aggregateId: string;
  type: string;
  transactionDate: string;
  symbol: string;
  shares: number;
  price: number;
  commission: number;
  createdAt: Date;
};

export type TransactionFormValues = {
  commission: number;
  price: number;
  shares: number;
  symbol: string;
  transactionDate: Date;
  type: string;
};
