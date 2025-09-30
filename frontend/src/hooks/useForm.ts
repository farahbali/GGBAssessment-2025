import { useState, useCallback, useMemo } from 'react';
import { validateFeedback } from '@/utils';
import { CreateFeedbackRequest, FormValidation } from '@/types';

interface UseFormOptions {
  initialValues?: CreateFeedbackRequest;
  onSubmit?: (values: CreateFeedbackRequest) => void | Promise<void>;
  validateOnChange?: boolean;
}

export const useForm = (options: UseFormOptions = {}) => {
  const {
    initialValues = { title: '', description: '' },
    onSubmit,
    validateOnChange = true,
  } = options;

  const [values, setValues] = useState<CreateFeedbackRequest>(initialValues);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const validation = useMemo((): FormValidation => {
    return validateFeedback(values);
  }, [values]);

  // Field handlers
  const setValue = useCallback((field: keyof CreateFeedbackRequest, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    if (validateOnChange) {
      setTouched(prev => ({ ...prev, [field]: true }));
    }
  }, [validateOnChange]);

  const setFieldTouched = useCallback((field: keyof CreateFeedbackRequest) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Submit handler
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validation.isValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validation.isValid, isSubmitting, onSubmit]);

  // Field props for easy integration
  const getFieldProps = useCallback((field: keyof CreateFeedbackRequest) => ({
    value: values[field],
    onChange: (value: string) => setValue(field, value),
    onBlur: () => setFieldTouched(field),
    error: touched[field] ? validation.errors[field] : undefined,
    touched: touched[field],
  }), [values, touched, validation.errors, setValue, setFieldTouched]);

  return {
    // Values
    values,
    touched,
    isSubmitting,
    
    // Validation
    validation,
    isValid: validation.isValid,
    errors: validation.errors,
    
    // Actions
    setValue,
    setFieldTouched,
    reset,
    handleSubmit,
    getFieldProps,
  };
};
