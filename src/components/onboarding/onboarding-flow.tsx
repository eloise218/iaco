'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfileForm } from './profile-form';
import { WelcomeStep } from './welcome-step';
import { CompleteStep } from './complete-step';
import { completeOnboarding, skipOnboarding } from '@/lib/actions/profile';
import { CompleteOnboardingInput } from '@/lib/validations/profile';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export interface OnboardingFlowProps {
  /**
   * Callback when onboarding is completed
   */
  onComplete?: () => void;
  /**
   * Whether to show the skip option
   */
  allowSkip?: boolean;
}

type OnboardingStep = 'welcome' | 'profile' | 'complete';

export function OnboardingFlow({ onComplete, allowSkip = true }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState(1);
  const router = useRouter();

  const steps: OnboardingStep[] = ['welcome', 'profile', 'complete'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  useEffect(() => {
    // Add smooth scroll to top on step change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setDirection(1);
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setDirection(-1);
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleProfileSubmit = async (data: CompleteOnboardingInput) => {
    setIsLoading(true);
    try {
      const result = await completeOnboarding(data);
      
      if (result.success) {
        setCurrentStep('complete');
      } else {
        toast.error(result.error || 'Failed to create profile');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!allowSkip) return;
    
    setIsLoading(true);
    try {
      const result = await skipOnboarding();
      
      if (result.success) {
        onComplete?.();
        router.push('/');
      } else {
        toast.error(result.error || 'Failed to skip onboarding');
      }
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    onComplete?.();
    router.push('/');
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">

      <div className="w-full max-w-2xl relative z-10">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-3">
            <motion.span
              key={currentStepIndex}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Step {currentStepIndex + 1} of {steps.length}
            </motion.span>
            <motion.span
              key={`progress-${progress}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-medium text-blue-600 dark:text-blue-400"
            >
              {Math.round(progress)}% Complete
            </motion.span>
          </div>
          <div className="relative h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow border bg-white dark:bg-gray-900 overflow-hidden">
            <CardHeader className="text-center pb-4 pt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {currentStep === 'welcome' && 'Welcome to Crypto Assistant'}
                    {currentStep === 'profile' && 'Tell us about yourself'}
                    {currentStep === 'complete' && "You're all set!"}
                  </CardTitle>
                </motion.div>
              </AnimatePresence>
            </CardHeader>

            <CardContent className="px-6 pb-8">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  {currentStep === 'welcome' && (
                    <WelcomeStep
                      onNext={handleNext}
                      onSkip={allowSkip ? handleSkip : undefined}
                      isLoading={isLoading}
                    />
                  )}

                  {currentStep === 'profile' && (
                    <ProfileForm
                      onSubmit={handleProfileSubmit}
                      onBack={handleBack}
                      onSkip={allowSkip ? handleSkip : undefined}
                      isLoading={isLoading}
                    />
                  )}

                  {currentStep === 'complete' && (
                    <CompleteStep
                      onComplete={handleComplete}
                      isLoading={isLoading}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Skip Option (shown on all steps except complete) */}
        {allowSkip && currentStep !== 'complete' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-6"
          >
            <Button
              variant="ghost"
              onClick={handleSkip}
              disabled={isLoading}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
            >
              Skip for now - I&apos;ll set this up later
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}