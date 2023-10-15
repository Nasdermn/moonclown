export const showNotification = (
  message,
  type,
  time,
  msgSetter,
  blockButtonSetter
) => {
  msgSetter({ message, type });
  //Если был передан сеттер блокировки кнопки, то мы блокируем кнопку на то же время
  if (blockButtonSetter) blockButtonSetter(true);
  setTimeout(() => {
    msgSetter({ message: '', type });
    if (blockButtonSetter) {
      blockButtonSetter(false);
    }
  }, time);
};
