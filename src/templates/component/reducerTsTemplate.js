module.exports = `
import { createReducer } from "@reduxjs/toolkit"
import {
  createTemplateName,
  readTemplateName,
  updateTemplateName,
  deleteTemplateName,
} from "./actions"

export interface TemplateNameState {}

export const initialState: TemplateNameState = {}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(createTemplateName, (state, action) => {
      //
    })
    .addCase(readTemplateName, (state, action) => {
      //
    })
    .addCase(updateTemplateName, (state, action) => {
      //
    })
    .addCase(deleteTemplateName, (state, action) => {
      //
    })
)
`;
