export type EasyTableModel = {
  key?: (object: any) => any;
  fields: EasyTableModelField[];
  actions?: EasyTableModelActions;
};

export type EasyTableModelActions = {
  label: string;
  render: (payload: any) => any;
};

export type EasyTableModelField = {
  label: string;
  resolve?: () => any | string;
  sort?: string;
};
