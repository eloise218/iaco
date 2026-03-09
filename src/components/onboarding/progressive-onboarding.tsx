'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '@/i18n/navigation';
import { toast } from 'sonner';
import gsap from 'gsap';
import { useTranslations } from 'next-intl';
import { completeOnboarding } from '@/lib/actions/profile';
import {
  GraduationCapIcon,
  RocketIcon,
  BookOpenIcon,
  TrendUpIcon,
  ChartPieIcon,
  ArrowRightIcon,
  CheckIcon
} from '@phosphor-icons/react';

interface OnboardingAnswer {
  experienceLevel: 'beginner' | 'intermediate' | null;
  objective: 'learn' | 'invest' | 'diversify' | null;
}

interface QuestionOption {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
}

export function ProgressiveOnboarding() {
  const router = useRouter();
  const t = useTranslations('onboarding');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswer>({
    experienceLevel: null,
    objective: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const totalSteps = 2;

  const levelOptions: QuestionOption[] = [
    {
      id: 'beginner',
      label: t('experience.beginner'),
      description: t('experience.beginnerDesc'),
      icon: GraduationCapIcon,
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-500/20',
    },
    {
      id: 'intermediate',
      label: t('experience.intermediate'),
      description: t('experience.intermediateDesc'),
      icon: RocketIcon,
      gradient: 'from-violet-500 to-purple-600',
      iconBg: 'bg-violet-500/20',
    },
  ];

  const objectiveOptions: QuestionOption[] = [
    {
      id: 'learn',
      label: t('goals.learning'),
      description: t('goals.learningDesc'),
      icon: BookOpenIcon,
      gradient: 'from-blue-500 to-cyan-600',
      iconBg: 'bg-blue-500/20',
    },
    {
      id: 'invest',
      label: t('goals.investing'),
      description: t('goals.investingDesc'),
      icon: TrendUpIcon,
      gradient: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-500/20',
    },
    {
      id: 'diversify',
      label: t('goals.diversify'),
      description: t('goals.diversifyDesc'),
      icon: ChartPieIcon,
      gradient: 'from-rose-500 to-pink-600',
      iconBg: 'bg-rose-500/20',
    },
  ];

  // Initial animation on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate container
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
      );

      // Animate progress bar
      gsap.fromTo(
        progressRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: 'power2.out' }
      );

      // Animate question
      gsap.fromTo(
        questionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power2.out' }
      );

      // Stagger animate options
      gsap.fromTo(
        '.option-card',
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.4,
          ease: 'back.out(1.2)',
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Handle option selection
  const handleOptionSelect = async (optionId: string) => {
    if (isSubmitting) return;

    setSelectedOption(optionId);

    // Animate selection
    gsap.to(`[data-option="${optionId}"]`, {
      scale: 1.02,
      duration: 0.2,
      ease: 'power2.out',
    });

    // Small delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (currentStep === 0) {
      // Save level and move to next step
      setAnswers((prev) => ({
        ...prev,
        experienceLevel: optionId as 'beginner' | 'intermediate',
      }));

      // Animate transition
      const tl = gsap.timeline();

      // Phase 1: Animate old content out
      tl.to('.option-card', {
        opacity: 0,
        y: -20,
        scale: 0.95,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.in',
      });

      tl.to(
        questionRef.current,
        {
          opacity: 0,
          x: -50,
          duration: 0.3,
          ease: 'power2.in',
        },
        '-=0.2'
      );

      // Switch content between out/in animations
      tl.call(() => {
        setCurrentStep(1);
        setSelectedOption(null);
      });

      // Progress bar animation
      tl.to(
        '.progress-fill',
        {
          width: '100%',
          duration: 0.4,
          ease: 'power2.inOut',
        },
        '-=0.3'
      );

      // Phase 2: Animate new content in (after React re-render)
      tl.fromTo(
        questionRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', delay: 0.05 }
      );

      tl.fromTo(
        '.option-card',
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: 'back.out(1.2)',
        },
        '-=0.2'
      );
    } else {
      // Final step - save and complete
      setIsSubmitting(true);

      const finalAnswers = {
        experienceLevel: answers.experienceLevel!,
        objective: optionId as 'learn' | 'invest' | 'diversify',
      };

      try {
        // Success animation before submitting
        const tl = gsap.timeline();

        tl.to('.option-card', {
          opacity: 0,
          y: -20,
          duration: 0.3,
          stagger: 0.05,
        });

        tl.to(questionRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.3,
        });

        // Show success state
        tl.to(containerRef.current, {
          scale: 1.02,
          duration: 0.2,
        });

        // Map objective to investment objectives array
        const objectiveMapping: Record<string, string[]> = {
          learn: ['learning'],
          invest: ['long-term-growth'],
          diversify: ['diversification'],
        };

        const result = await completeOnboarding({
          experienceLevel: finalAnswers.experienceLevel,
          investmentObjectives: objectiveMapping[finalAnswers.objective],
          riskTolerance: 'low',
          skipOnboarding: false,
        });

        if (result.success) {
          toast.success(t('complete.title'));

          // Final celebration animation
          gsap.to(containerRef.current, {
            scale: 0.95,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
              router.push('/challenge');
            },
          });
        } else {
          toast.error(result.error || t('error'));
          setIsSubmitting(false);
          setSelectedOption(null);

          // Reset animation
          gsap.to([questionRef.current, '.option-card'], {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
          });
        }
      } catch {
        toast.error(t('error'));
        setIsSubmitting(false);
        setSelectedOption(null);
      }
    }
  };

  const currentOptions = currentStep === 0 ? levelOptions : objectiveOptions;
  const currentQuestion = currentStep === 0
    ? t('experience.title')
    : t('goals.title');
  const currentSubtext = currentStep === 0
    ? t('progress.subtextExperience')
    : t('progress.subtextGoals');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div ref={containerRef} className="w-full max-w-lg relative z-10 opacity-0">
        {/* Progress indicator */}
        <div ref={progressRef} className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-400">
              {t('progress.step', { current: currentStep + 1, total: totalSteps })}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="progress-fill h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-3 mt-4">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index <= currentStep
                  ? 'bg-white scale-110'
                  : 'bg-slate-700'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Main card */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800/50 shadow-2xl shadow-black/20 p-8 md:p-10">
          {/* Question */}
          <div ref={questionRef} className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              {currentQuestion}
            </h1>
            <p className="text-slate-400 text-lg">{currentSubtext}</p>
          </div>

          {/* Options */}
          <div ref={optionsRef} className="space-y-4">
            {currentOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedOption === option.id;

              return (
                <button
                  key={option.id}
                  data-option={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={isSubmitting}
                  className={`option-card w-full group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${isSelected
                    ? 'border-white/30 bg-gradient-to-r ' + option.gradient
                    : 'border-slate-700/50 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="relative z-10 flex items-center gap-5 p-5 md:p-6">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${isSelected
                        ? 'bg-white/20'
                        : option.iconBg
                        }`}
                    >
                      <Icon
                        className={`w-7 h-7 transition-all duration-300 ${isSelected ? 'text-white' : 'text-slate-300'
                          }`}
                      />
                    </div>

                    {/* Text content */}
                    <div className="flex-1 text-left">
                      <h3
                        className={`text-xl font-semibold mb-1 transition-colors duration-300 ${isSelected ? 'text-white' : 'text-slate-200'
                          }`}
                      >
                        {option.label}
                      </h3>
                      <p
                        className={`text-sm transition-colors duration-300 ${isSelected ? 'text-white/80' : 'text-slate-400'
                          }`}
                      >
                        {option.description}
                      </p>
                    </div>

                    {/* Arrow / Check indicator */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected
                        ? 'bg-white/20'
                        : 'bg-slate-700/50 group-hover:bg-slate-700'
                        }`}
                    >
                      {isSelected ? (
                        <CheckIcon className="w-5 h-5 text-white" weight="bold" />
                      ) : (
                        <ArrowRightIcon
                          className={`w-5 h-5 transition-all duration-300 ${isSelected ? 'text-white' : 'text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5'
                            }`}
                        />
                      )}
                    </div>
                  </div>

                  {/* Hover gradient overlay */}
                  {!isSelected && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${option.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Educational disclaimer */}
          <div className="mt-8 pt-6 border-t border-slate-800/50">
            <p className="text-center text-xs text-slate-500 leading-relaxed whitespace-pre-line">
              🎓 {t('progress.disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
