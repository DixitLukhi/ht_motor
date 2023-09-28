import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profile: {},
    user: {},
};

const accountSlice = createSlice({
    name: "accountSlice",
    initialState,
    reducers: {
        // removeToken: (state, action) => {
        //     localStorage.clear();
        //     state.user = {};
        // },
        // setKey: (state, action) => {
        //     state.key = action.payload
        // }
    },
    extraReducers: (builder) => {
        // builder.addCase(getProfile.fulfilled, (state, action) => {
        //     state.profile = action?.payload?.data?.Data;
        // });
    },
});

export default accountSlice.reducer;

// export const { removeToken, setKey } = accountSlice.actions;
