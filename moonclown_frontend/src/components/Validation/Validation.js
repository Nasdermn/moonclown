import { useState } from 'react';

export function useFormWithValidation(initialValues) {
  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  //Функционал компонента для конкретных полей
  const inputValidationConfig = {
    name: {
      pattern: /^[\s\wа-яА-ЯёЁ-]+$/i, // Латиница, кириллица, пробел, нижнее подчеркивание и дефис (хотя бы 2 символа)
      errorMessage:
        'Пожалуйста, введите имя с использованием только латиницы, кириллицы, пробела и дефиса.',
    },
    email: {
      pattern: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, // email
      errorMessage: 'Пожалуйста, введите настоящий адрес электронной почты.',
    },
    password: {
      pattern: /^[a-zA-Z0-9]+$/, // Латиница и цифры
      errorMessage: 'Пароль должен состоять только из латиницы и цифр.',
    },
    code: {
      pattern: /^\d{6}$/,
      errorMessage: 'Пожалуйста, введите сюда код подтверждения из 6 цифр.',
    },
    avatar: {
      pattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
      errorMessage:
        'Пожалуйста, введите ссылку на фотографию из открытого источника.',
    },
    oldpassword: {
      pattern: /^[a-zA-Z0-9]+$/,
      errorMessage: 'Старый пароль должен состоять только из латиницы и цифр.',
    },
    newpassword: {
      pattern: /^[a-zA-Z0-9]+$/,
      errorMessage: 'Новый пароль должен состоять только из латиницы и цифр.',
    },
    confirmpassword: {
      pattern: /^[a-zA-Z0-9]+$/,
      errorMessage:
        'Подтверждение пароля должно состоять только из латиницы и цифр.',
    },
  };

  const handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    setValues({ ...values, [name]: value });
    const isValidField = target.checkValidity(); // Проверка стандартной валидации

    if (!isValidField) {
      setErrors({ ...errors, [name]: target.validationMessage });
    } else if (inputValidationConfig[name]?.pattern) {
      const isCustomValidField =
        inputValidationConfig[name].pattern.test(value);
      setErrors({
        ...errors,
        [name]: isCustomValidField
          ? ''
          : inputValidationConfig[name].errorMessage,
      });
    } else {
      setErrors({ ...errors, [name]: '' });
    }

    let allFieldsValid = true; // Изначально считаем, что все поля валидны
    const form = target.closest('form');
    const formElements = form.elements;
    for (let i = 0; i < formElements.length; i++) {
      const field = formElements[i];
      const fieldName = field.name;
      if (inputValidationConfig[fieldName]?.pattern) {
        const isValidField = inputValidationConfig[fieldName].pattern.test(
          field.value
        );
        if (!isValidField) {
          allFieldsValid = false; // Если хоть одно поле не валидно, устанавливаем флаг в false
        }
      }
    }

    setIsValid(allFieldsValid && form.checkValidity()); // Устанавливаем isValid в зависимости от состояния всех полей
  };

  return {
    values,
    setValues,
    handleChange,
    errors,
    setErrors,
    isValid,
    setIsValid,
  };
}
