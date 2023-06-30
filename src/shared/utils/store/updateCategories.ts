import { PayloadAction } from "@reduxjs/toolkit";

import { CategoryState } from "../../../store/categorySlice";
import { ICategory } from "../../../store/types";

export const updateCategories = (
  state: CategoryState,
  action: PayloadAction<{ data: ICategory[], params: string }>
) => {
  const { data, params } = action.payload;

  switch (params) {
    case "":
      state.categories.all = data;
      break;
    case "?type_of_outlay=income":
      state.categories.income = data;
      break;
    case "?type_of_outlay=expense":
      state.categories.expense = data;
      break;
    default:
      break;
  }
}