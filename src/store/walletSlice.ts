import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DataEntryFormData, IWallet, MethodTypes } from './types';
import { $api, WALLET_PATH } from '../api/api';
import { UserState } from './userSlice';

type WalletState = {
  wallets: IWallet[];
  activeWallet: IWallet;
  isLoading: boolean;
  error: string | null;
  isEntryDataSuccess: boolean;
  isAddWalletSuccess: boolean;
  isEditWalletSuccess: boolean;
  isDeleteWalletSuccess: boolean;
  entryDataError: string | null;
}

type WalletActionPayload = {
  method: MethodTypes;
  data?: IWallet;
  id?: string;
}

export const walletAction = createAsyncThunk<
  IWallet[],
  WalletActionPayload,
  { rejectValue: string }
>(
  'wallet/walletAction',
  async function (payload, { rejectWithValue }) {
    const { method, data, id } = payload;

    if (method !== "GET") {
      $api({
        method,
        url: `${WALLET_PATH}${id ? (id + '/') : ''}`,
        data: data || {},
      })
        .then(response => response?.data)
        .catch(error => {
          return rejectWithValue('Помилка');
        });
    }

    return await $api.get(WALLET_PATH)
      .then(res => res?.data)
      .catch(error => {
        return rejectWithValue(`Помилка`)
      });
  }
);

export const getWallets = createAsyncThunk<IWallet[], undefined, { rejectValue: string }>(
  'wallet/getWallets',
  async function (_, { rejectWithValue }) {
    return $api.get(WALLET_PATH)
      .then(res => res?.data)
      .catch(error => {
        const errorMessage = error.response.data;
        return rejectWithValue("error in get wallets");
      });
  }
);

export const postEntryData = createAsyncThunk<
  undefined,
  DataEntryFormData,
  { rejectValue: string, state: { user: UserState } }
>(
  'wallet/postEntryData',
  async function (data, { rejectWithValue }) {
    const { amountAccount, availableCash, cardAccountName, userId } = data

    if (!userId) {
      return rejectWithValue('Помилка при внесенні рахунків. Спочатку створіть акаунт.');
    }

    const cashWallet: IWallet = {
      title: "Готівка",
      amount: availableCash,
      owner: userId,
      type_of_account: "cash",
    }
    const bankWallet: IWallet = {
      title: cardAccountName,
      amount: amountAccount,
      owner: userId,
      type_of_account: "bank",
    }

    const postCashWalletResponsePromise = await $api.post(
      WALLET_PATH,
      cashWallet,
    )
      .then(response => response.status)
      .catch(error => {
        return rejectWithValue('Помилка при створенні рахунку');
      });

    const postBankWalletResponsePromise = await $api.post(
      WALLET_PATH,
      bankWallet,
    )
      .then(response => response.status)
      .catch(error => {
        return rejectWithValue('Помилка при створенні рахунку');
      });

    const [postCashWalletResponse, postBankWalletResponse] = await Promise.all(
      [postCashWalletResponsePromise, postBankWalletResponsePromise]
    );

    if (postCashWalletResponse !== 201 || postBankWalletResponse !== 201) {
      return rejectWithValue('Can\'t create wallets. Server error.');
    }

    localStorage.setItem("isDataEntrySuccess", "true");
  }
);

const initialState: WalletState = {
  wallets: [],
  activeWallet: null,
  isLoading: false,
  error: null,
  isEntryDataSuccess: false,
  isAddWalletSuccess: false,
  isEditWalletSuccess: false,
  isDeleteWalletSuccess: false,
  entryDataError: null,
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    resetWalletState: (state) => {
      return initialState;
    },
    resetError: (state) => {
      state.error = null;
    },
    setActiveWallet: (state, action) => {
      state.activeWallet = action.payload;
    },
    setSuccessStatus: (state, action) => {
      state.isAddWalletSuccess = action.payload;
      state.isEditWalletSuccess = action.payload;
      state.isDeleteWalletSuccess = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(walletAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAddWalletSuccess = false;
        state.isEditWalletSuccess = false;
        state.isDeleteWalletSuccess = false;
      })
      .addCase(walletAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wallets = action.payload;
        state.isAddWalletSuccess = true;
        state.isEditWalletSuccess = true;
        state.isDeleteWalletSuccess = true;
        state.error = null;
      })
      .addCase(walletAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getWallets.pending, (state) => {
        state.error = null;
      })
      .addCase(getWallets.fulfilled, (state, action) => {
        state.wallets = action.payload;
      })
      .addCase(getWallets.rejected, (state, action) => {
        state.error = action.payload
      })

      .addCase(postEntryData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(postEntryData.fulfilled, (state) => {
        state.isLoading = false;
        state.isEntryDataSuccess = true;
      })
      .addCase(postEntryData.rejected, (state, action) => {
        state.isLoading = false;
        state.entryDataError = action.payload;
      })
  }
});

export const {
  resetError,
  resetWalletState,
  setActiveWallet,
  setSuccessStatus,
} = walletSlice.actions;

export default walletSlice.reducer;
