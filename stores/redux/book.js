import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookScrollTo: 0, // Index to scroll to
  menuScrollTo: 0, // Index to scroll to
  bookContents: [],
  menuContents: [],
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    setBookScrollTo: (state, action) => {
      const bookScrollTo = action.payload.bookScrollTo;
      return {
        ...state,
        bookScrollTo: bookScrollTo,
      };
    },
    setMenuScrollTo: (state, action) => {
      const menuScrollTo = action.payload.menuScrollTo;
      return {
        ...state,
        menuScrollTo: menuScrollTo,
      };
    },
  },
});

export const { setBookScrollTo } = bookSlice.actions;
export const { setMenuScrollTo } = bookSlice.actions;

export default bookSlice.reducer;
