import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/transactions", transactionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTransactionStatus = createAsyncThunk(
  "transaction/fetchTransactionStatus",
  async (transactionId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/transactions/verify/${transactionId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    transaction: null,
    loading: false,
    error: null,
    status: null,
  },
  reducers: {
    clearTransactionState: (state) => {
      state.transaction = null;
      state.loading = false;
      state.error = null;
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transaction = action.payload;
        state.status = action.payload.status;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTransactionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
      })
      .addCase(fetchTransactionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTransactionState } = transactionSlice.actions;
export default transactionSlice.reducer;
