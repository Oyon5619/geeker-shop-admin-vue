export interface SubmitFormRef {
  onSubmit: (callback?: () => void | Promise<void>) => void;
}
