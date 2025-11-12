'use client';

import { AnimationStep } from '@/animations/events/DaNang1858Steps';
import { daNang1858AnimationSteps } from '@/animations/events/DaNang1858Steps';
import { getVoiceContent, getIntroVoice as getIntroVoiceContent } from '@/animations/voices/DaNang1858Voice';

/**
 * Component chuyên biệt cho animation sự kiện Đà Nẵng 1858
 * Quản lý riêng animation steps và voice content
 */

export interface EventAnimationConfig {
  steps: AnimationStep[];
  getVoiceForStep: (stepIndex: number) => string;
  getIntroVoice?: (withPacing?: boolean) => string;
  eventName: string;
  eventId: string;
}

/**
 * Cấu hình animation cho sự kiện Đà Nẵng 1858
 */
export const daNang1858Config: EventAnimationConfig = {
  steps: daNang1858AnimationSteps,
  getVoiceForStep: getVoiceContent,
  getIntroVoice: getIntroVoiceContent,
  eventName: 'Pháp đánh Đà Nẵng 1858',
  eventId: 'event-001',
};

/**
 * Hook để sử dụng animation config cho Đà Nẵng 1858
 */
export const useDaNang1858Animation = () => {
  return daNang1858Config;
};

/**
 * Hàm helper để lấy step theo index
 */
export const getDaNang1858Step = (stepIndex: number): AnimationStep | null => {
  if (stepIndex < 0 || stepIndex >= daNang1858AnimationSteps.length) {
    return null;
  }
  return daNang1858AnimationSteps[stepIndex];
};

/**
 * Hàm helper để lấy tổng số steps
 */
export const getDaNang1858StepCount = (): number => {
  return daNang1858AnimationSteps.length;
};

/**
 * Hàm helper để validate step index
 */
export const isValidDaNang1858StepIndex = (stepIndex: number): boolean => {
  return stepIndex >= 0 && stepIndex < daNang1858AnimationSteps.length;
};
