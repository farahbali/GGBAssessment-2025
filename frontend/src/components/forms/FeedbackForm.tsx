import React, { useEffect } from 'react';
import { useForm } from '@/hooks';
import { useFeedback } from '@/hooks';

import { Button, Input, Textarea } from '@/components/ui';
import { VALIDATION_RULES, SUCCESS_MESSAGES } from '@/constants';
import { CreateFeedbackRequest } from '@/types';

const FeedbackForm: React.FC = () => {
  const { addFeedback } = useFeedback();
  const {
    values,
    validation,
    isSubmitting,
    getFieldProps,
    handleSubmit,
    reset,
  } = useForm<CreateFeedbackRequest>({
    initialValues: { title: '', description: '' },
    onSubmit: async (data:any) => {
      const result = await addFeedback(data);
      if (result.success) {
        reset();
        // You could add a toast notification here
        console.log(SUCCESS_MESSAGES.FEEDBACK_CREATED);
      }
    },
  });

  const titleProps = getFieldProps('title');
  const descriptionProps = getFieldProps('description');

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Submit New Feedback
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={titleProps.value}
          onChange={titleProps.onChange}
          onBlur={titleProps.onBlur}
          placeholder="Enter a brief title for your feedback"
          error={titleProps.error}
          required
          maxLength={VALIDATION_RULES.TITLE.MAX_LENGTH}
        />
        
        <Textarea
          label="Description"
          value={descriptionProps.value}
          onChange={descriptionProps.onChange}
          onBlur={descriptionProps.onBlur}
          placeholder="Describe your feedback in detail"
          error={descriptionProps.error}
          required
          maxLength={VALIDATION_RULES.DESCRIPTION.MAX_LENGTH}
          rows={4}
        />
        
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={reset}
            disabled={isSubmitting}
          >
            Clear
          </Button>
          
          <Button
            type="submit"
            disabled={!validation.isValid || isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
