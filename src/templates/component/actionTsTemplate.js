module.exports = `
import { createAction } from "@reduxjs/toolkit"

// export interface ITemplateName {}

export const createTemplateName = createAction<{ params: any }>(
  "TemplateName/create"
)
export const readTemplateName = createAction<{ params: any }>(
  "TemplateName/read"
)
export const updateTemplateName = createAction<{ params: any }>(
  "TemplateName/update"
)
export const deleteTemplateName = createAction<{ params: any }>(
  "TemplateName/delete"
)
`;
