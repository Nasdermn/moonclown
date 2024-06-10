import { ISetter, IErrorSetter } from './interfaces';

export const showError = (
  message: string,
  time: number,
  errorSetter: IErrorSetter,
  blockButtonSetter?: ISetter,
  blockInputSetter?: ISetter,
) => {
  errorSetter(message);
  if (blockButtonSetter) blockButtonSetter(true);
  if (blockInputSetter) blockInputSetter(true);
  setTimeout(() => {
    errorSetter('');
    if (blockButtonSetter) {
      blockButtonSetter(false);
    }
    if (blockInputSetter) {
      blockInputSetter(false);
    }
  }, time);
};
