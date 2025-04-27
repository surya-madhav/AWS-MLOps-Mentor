'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { memo } from 'react';
import { UseChatHelpers } from '@ai-sdk/react';

interface SuggestedActionsProps {
  chatId: string;
  append: UseChatHelpers['append'];
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: 'Generate sample code to',
      label: 'train a model using SageMaker',
      action:
        'Generate sample code to train and deploy a model using AWS SageMaker',
    },
    {
      title: 'Write a report on',
      label: 'Amazon SageMaker vs EC2 for ML training',
      action:
        'Write a report comparing Amazon SageMaker and EC2 for machine learning training workloads',
    },
    {
      title: 'Explain how to',
      label: 'optimize hyperparameters in AWS',
      action:
        'Explain how to use Amazon SageMaker Automatic Model Tuning for hyperparameter optimization',
    },
    {
      title: 'What are the best practices',
      label: 'for ML model deployment on AWS?',
      action:
        'What are the best practices for deploying machine learning models on AWS securely and cost-effectively?',
    },
  ];
  

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`);

              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
