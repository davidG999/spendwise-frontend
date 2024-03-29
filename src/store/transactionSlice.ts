import { createSlice, createAsyncThunk, } from '@reduxjs/toolkit';
import { ITransaction, MethodTypes, Transactions } from './types';
import { $api, TRANSACTION_PATH } from '../api/api';
import { getUserDetails } from './userSlice';

export type FilterByTypeOfOutlayOptions = "all" | "income" | "expense";

type TransactionState = {
  filterByTypeOfOutlay: FilterByTypeOfOutlayOptions;
  transactions: {
    all: Transactions;
    income: Transactions;
    expense: Transactions;
  };
  activeTransaction: ITransaction;
  addTransactionData: ITransaction;
  editTransactionData: ITransaction;
  isLoading: boolean;
  error: string | null;
  isAddTransactionSuccess: boolean;
  isEditTransactionSuccess: boolean;
  isDeleteTransactionSuccess: boolean;
  isEditTransactionOpen: boolean;
}

type TransactionActionPayload = {
  method: MethodTypes;
  data?: ITransaction;
  id?: string;
}

export const transactionAction = createAsyncThunk<
  Transactions,
  TransactionActionPayload,
  { rejectValue: string }
>(
  'transaction/transactionAction',
  async function (payload, { rejectWithValue }) {
    const { method, data, id } = payload;

    if (method !== "GET") {
      $api({
        method,
        url: `${TRANSACTION_PATH}${id ? (id + '/') : ''}`,
        data: data || {},
      })
        .then(response => response?.data)
        .catch(error => {
          return rejectWithValue('Помилка');
        });
    }

    return await $api.get(TRANSACTION_PATH)
      .then(res => res?.data)
      .catch(error => {
        return rejectWithValue(`Помилка`)
      });
  }
);

export const getTransactions = createAsyncThunk<
  Transactions,
  undefined,
  { rejectValue: string }
>(
  'transaction/getTransactions',
  async function (_, { rejectWithValue }) {
    return $api.get(TRANSACTION_PATH)
      .then(res => res?.data)
      .catch(error => {
        const errorMessage = error.response.data;
        return rejectWithValue(errorMessage);
      });
  }
);

export const getFilteredTransactions = createAsyncThunk<
  { data: Transactions, params: string },
  string,
  { rejectValue: string }
>(
  'transaction/getFilteredTransactions',
  async function (params, { rejectWithValue }) {
    try {
      const res = await $api.get(`${TRANSACTION_PATH}${params}`);
      const data = res?.data;
      return { data, params };
    } catch (error) {
      const errorMessage = error.response.data;
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState: TransactionState = {
  filterByTypeOfOutlay: "all",
  transactions: {
    all: {},
    income: {},
    expense: {},
  },
  activeTransaction: null,
  addTransactionData: null,
  editTransactionData: null,
  isLoading: false,
  error: null,
  isAddTransactionSuccess: false,
  isEditTransactionSuccess: false,
  isDeleteTransactionSuccess: false,
  isEditTransactionOpen: false,
}

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    resetTransactionState: () => {
      return initialState;
    },
    resetError: (state) => {
      state.error = null;
    },
    resetActiveTransactionState: (state, action) => {
      state.activeTransaction = action.payload;
      state.editTransactionData = action.payload;
    },
    setActiveTransaction: (state, action) => {
      state.activeTransaction = action.payload;
    },
    setFilterByTypeOfOutlay: (state, action) => {
      state.filterByTypeOfOutlay = action.payload;
    },
    setAddTransactionData: (state, action) => {
      state.addTransactionData = {
        ...state.addTransactionData,
        ...action.payload,
      }
    },
    setEditTransactionData: (state, action) => {
      state.editTransactionData = {
        ...state.editTransactionData,
        ...action.payload,
      }
    },
    setSuccessStatus: (state, action) => {
      state.isAddTransactionSuccess = action.payload;
      state.isEditTransactionSuccess = action.payload;
      state.isDeleteTransactionSuccess = action.payload;
    },
    setIsEditTransactionOpen: (state, action) => {
      state.isEditTransactionOpen = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(transactionAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAddTransactionSuccess = false;
        state.isEditTransactionSuccess = false;
        state.isDeleteTransactionSuccess = false;
      })
      .addCase(transactionAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.transactions.all = action.payload;
        state.isAddTransactionSuccess = true;
        state.isEditTransactionSuccess = true;
        state.isDeleteTransactionSuccess = true;
      })
      .addCase(transactionAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getTransactions.pending, (state) => {
        state.error = null;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.transactions.all = action.payload;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(getFilteredTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFilteredTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        const { data, params } = action.payload;
        switch (params) {
          case "":
            state.transactions.all = data;
            break;
          case "?type_of_outlay=income":
            state.transactions.income = data;
            break;
          case "?type_of_outlay=expense":
            state.transactions.expense = data;
            break;
          default:
            break;
        }
      })
      .addCase(getFilteredTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getUserDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
  }
});

export const {
  resetTransactionState,
  resetError,
  resetActiveTransactionState,
  setActiveTransaction,
  setFilterByTypeOfOutlay,
  setAddTransactionData,
  setEditTransactionData,
  setSuccessStatus,
  setIsEditTransactionOpen
} = transactionSlice.actions;

export default transactionSlice.reducer;
