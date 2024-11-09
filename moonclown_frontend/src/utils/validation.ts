import { useState } from 'react';
import { IFormErrors, IFormValues } from './interfaces';

export function useFormValidation(initialValues: IFormValues) {
  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState<IFormErrors>({});
  const [isValid, setIsValid] = useState(false);

  const inputValidationConfig = {
    name: {
      pattern: /^[a-zA-Zа-яА-ЯёЁ\d\s-]{2,30}$/,
      errorMessage:
        'Пожалуйста, введите имя с использованием только латиницы, кириллицы, пробелов и дефисов.',
    },
    email: {
      pattern: /^[a-zA-Z0-9._-]{2,42}@[a-zA-Z0-9-]{2,15}\.[a-zA-Z]{2,15}$/,
      errorMessage: 'Пожалуйста, введите настоящий адрес электронной почты.',
    },
    password: {
      pattern: /^[a-zA-Z0-9]{8,24}$/,
      errorMessage: 'Пароль должен состоять только из латиницы и цифр.',
    },
    code: {
      pattern: /^\d{6}$/,
      errorMessage: 'Пожалуйста, введите сюда код подтверждения из 6 цифр.',
    },
    oldpassword: {
      pattern: /^[a-zA-Z0-9]{8,24}$/,
      errorMessage: 'Старый пароль должен состоять только из латиницы и цифр.',
    },
    newpassword: {
      pattern: /^[a-zA-Z0-9]{8,24}$/,
      errorMessage: 'Новый пароль должен состоять только из латиницы и цифр.',
    },
    confirmpassword: {
      pattern: /^[a-zA-Z0-9]{8,24}$/,
      errorMessage: 'Пароль должен состоять только из латиницы и цифр.',
    },
    message: {
      pattern: /^[a-zA-Zа-яА-ЯёЁ\d,.!?():;@_=\-+"№/\\\s]{20,1000}$/,
      errorMessage:
        'Сообщение может состоять из латиницы, кириллицы, цифр и следующих символов: ,.!?():;@_=-+"№/\\',
    },
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    setValues({ ...values, [name]: value });
    const isValidField = target.checkValidity();

    if (!isValidField) {
      setErrors({ ...errors, [name]: target.validationMessage });
    } else {
      if (name in inputValidationConfig) {
        const config = inputValidationConfig[name as keyof typeof inputValidationConfig];
        const isCustomValidField = config.pattern.test(value);
        setErrors({
          ...errors,
          [name]: isCustomValidField ? '' : config.errorMessage,
        });
      } else {
        setErrors({ ...errors, [name]: '' });
      }
    }

    let allFieldsValid = true;
    const form = target.closest('form');
    if (form) {
      const formElements = form.elements;
      for (let i = 0; i < formElements.length; i++) {
        const field = formElements[i] as HTMLInputElement;
        const fieldName = field.name;
        if (fieldName in inputValidationConfig) {
          const config = inputValidationConfig[fieldName as keyof typeof inputValidationConfig];
          const isValidField = config.pattern.test(field.value);
          if (!isValidField) {
            allFieldsValid = false;
            break;
          }
        }
      }
    }

    setIsValid(allFieldsValid && form?.checkValidity() !== false);
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
