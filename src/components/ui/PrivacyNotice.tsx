'use client';

import { useState, useEffect } from 'react';
import { ReadingType } from '@/lib/reading/types';
import { Card } from './Card';
import { Button } from './Button';

interface PrivacyNoticeProps {
  featureType: ReadingType;
  featureName: string;
  onDismiss?: () => void;
}

const PRIVACY_NOTICE_PREFIX = 'privacy_notice_shown_';

/**
 * Check if privacy notice has been shown for a feature type
 */
function hasShownPrivacyNotice(featureType: ReadingType): boolean {
  if (typeof window === 'undefined') return false;
  const key = `${PRIVACY_NOTICE_PREFIX}${featureType}`;
  return localStorage.getItem(key) === 'true';
}

/**
 * Mark privacy notice as shown for a feature type
 */
function markPrivacyNoticeShown(featureType: ReadingType): void {
  if (typeof window === 'undefined') return;
  const key = `${PRIVACY_NOTICE_PREFIX}${featureType}`;
  localStorage.setItem(key, 'true');
}

/**
 * Privacy Notice Component
 * 
 * Displays a privacy notice on first use of each feature type.
 * Tracks display state in localStorage per feature.
 */
export function PrivacyNotice({ featureType, featureName, onDismiss }: PrivacyNoticeProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if notice has been shown for this feature type
    const hasShown = hasShownPrivacyNotice(featureType);
    setIsVisible(!hasShown);
  }, [featureType]);

  const handleDismiss = () => {
    // Mark as shown
    markPrivacyNoticeShown(featureType);
    setIsVisible(false);
    
    // Call optional callback
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="max-w-md w-full p-6 space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-fg">
            🔒 ความเป็นส่วนตัวของคุณ
          </h2>
          <p className="text-sm text-fg-muted">
            ยินดีต้อนรับสู่ {featureName}
          </p>
        </div>

        <div className="space-y-3 text-sm text-fg-muted">
          <div className="flex items-start gap-2">
            <span className="text-base">📱</span>
            <div>
              <p className="font-medium text-fg">จัดเก็บในเครื่องเท่านั้น</p>
              <p>ข้อมูลของคุณถูกเก็บไว้ในเบราว์เซอร์ของคุณเท่านั้น ไม่มีการส่งไปยังเซิร์ฟเวอร์</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-base">🤖</span>
            <div>
              <p className="font-medium text-fg">AI เพื่อคำทำนาย</p>
              <p>เราใช้ Gemini AI เพื่อสร้างคำทำนายที่เป็นส่วนตัวสำหรับคุณ ข้อมูลจะถูกส่งไปยัง Google Gemini API เท่านั้น</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-base">🚫</span>
            <div>
              <p className="font-medium text-fg">ไม่มีคุกกี้</p>
              <p>เราไม่ใช้คุกกี้ในการติดตามพฤติกรรมของคุณ</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-base">🗑️</span>
            <div>
              <p className="font-medium text-fg">ลบได้ทุกเมื่อ</p>
              <p>คุณสามารถลบข้อมูลทั้งหมดได้ตลอดเวลาในหน้าการตั้งค่า</p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={handleDismiss}
            className="w-full"
          >
            เข้าใจแล้ว เริ่มใช้งาน
          </Button>
        </div>

        <p className="text-xs text-center text-fg-muted">
          การใช้งานต่อถือว่าคุณยอมรับนโยบายความเป็นส่วนตัวของเรา
        </p>
      </Card>
    </div>
  );
}

/**
 * Hook to check if privacy notice should be shown
 */
export function usePrivacyNotice(featureType: ReadingType) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const hasShown = hasShownPrivacyNotice(featureType);
    setShouldShow(!hasShown);
  }, [featureType]);

  const markAsShown = () => {
    markPrivacyNoticeShown(featureType);
    setShouldShow(false);
  };

  return {
    shouldShow,
    markAsShown
  };
}
