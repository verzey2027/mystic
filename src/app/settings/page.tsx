'use client';

import { useState } from 'react';
import { AppBar } from '@/components/nav/AppBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function SettingsPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleClearData = () => {
    setShowConfirm(true);
  };

  const handleConfirmClear = () => {
    setIsClearing(true);
    
    try {
      // Clear all fortune-related data from localStorage
      const keysToRemove: string[] = [];
      
      // Iterate through all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        if (key) {
          // Remove reading library
          if (key.startsWith('reffortune.library')) {
            keysToRemove.push(key);
          }
          // Remove cache entries
          if (key.startsWith('fortune_cache_')) {
            keysToRemove.push(key);
          }
          // Remove free reading flags
          if (key.startsWith('free_readings_')) {
            keysToRemove.push(key);
          }
          // Remove credits
          if (key === 'mf.user.credits') {
            keysToRemove.push(key);
          }
          // Remove free reading count
          if (key === 'mf.reading.freeCount') {
            keysToRemove.push(key);
          }
          // Remove privacy notice flags
          if (key.startsWith('privacy_notice_shown_')) {
            keysToRemove.push(key);
          }
        }
      }
      
      // Remove all identified keys
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      setShowConfirm(false);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to clear data:', error);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsClearing(false);
    }
  };

  const handleCancelClear = () => {
    setShowConfirm(false);
  };

  return (
    <main className="mx-auto w-full max-w-lg">
      <AppBar title="การตั้งค่า" backHref="/profile" />
      
      <div className="px-5 pb-8 space-y-4">
        {/* Success message */}
        {showSuccess && (
          <Alert tone="success">
            <div className="text-sm">
              ลบข้อมูลทั้งหมดเรียบร้อยแล้ว
            </div>
          </Alert>
        )}

        {/* Data Management Section */}
        <Card className="p-5">
          <h2 className="text-base font-semibold text-fg mb-2">
            การจัดการข้อมูล
          </h2>
          <p className="text-sm text-fg-muted mb-4">
            ข้อมูลทั้งหมดของคุณถูกเก็บไว้ในเครื่องของคุณเท่านั้น ไม่มีการส่งข้อมูลไปยังเซิร์ฟเวอร์
          </p>
          
          <div className="space-y-3">
            <div className="text-sm">
              <p className="font-medium text-fg mb-1">ข้อมูลที่จัดเก็บ:</p>
              <ul className="list-disc list-inside text-fg-muted space-y-1 ml-2">
                <li>ประวัติการดูดวงทั้งหมด</li>
                <li>ข้อมูลส่วนตัว (วันเกิด, ชื่อ)</li>
                <li>แคชการดูดวง</li>
                <li>สถานะการใช้งานฟรี</li>
                <li>เครดิตที่เหลือ</li>
              </ul>
            </div>
            
            <Button
              onClick={handleClearData}
              variant="danger"
              className="w-full"
              disabled={isClearing}
            >
              {isClearing ? 'กำลังลบข้อมูล...' : 'ลบข้อมูลทั้งหมด'}
            </Button>
          </div>
        </Card>

        {/* Confirmation Dialog */}
        {showConfirm && (
          <Card className="p-5 border-2 border-red-500">
            <h3 className="text-base font-semibold text-fg mb-2">
              ยืนยันการลบข้อมูล
            </h3>
            <p className="text-sm text-fg-muted mb-4">
              คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <p className="text-sm text-red-600 mb-4">
              ข้อมูลที่จะถูกลบ:
            </p>
            <ul className="list-disc list-inside text-sm text-fg-muted mb-4 ml-2">
              <li>ประวัติการดูดวงทั้งหมด (ไม่สามารถกู้คืนได้)</li>
              <li>ข้อมูลส่วนตัวที่บันทึกไว้</li>
              <li>เครดิตที่เหลืออยู่</li>
              <li>สถานะการใช้งานฟรี (จะได้รับสิทธิ์ฟรีใหม่)</li>
            </ul>
            
            <div className="flex gap-3">
              <Button
                onClick={handleCancelClear}
                variant="secondary"
                className="flex-1"
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleConfirmClear}
                variant="danger"
                className="flex-1"
                disabled={isClearing}
              >
                {isClearing ? 'กำลังลบ...' : 'ยืนยันการลบ'}
              </Button>
            </div>
          </Card>
        )}

        {/* Privacy Information */}
        <Card className="p-5">
          <h2 className="text-base font-semibold text-fg mb-2">
            ความเป็นส่วนตัว
          </h2>
          <div className="text-sm text-fg-muted space-y-2">
            <p>
              🔒 ข้อมูลของคุณปลอดภัย: เราไม่เก็บข้อมูลของคุณบนเซิร์ฟเวอร์
            </p>
            <p>
              📱 จัดเก็บในเครื่อง: ข้อมูลทั้งหมดอยู่ในเบราว์เซอร์ของคุณเท่านั้น
            </p>
            <p>
              🚫 ไม่มีคุกกี้: เราไม่ใช้คุกกี้ในการติดตามพฤติกรรม
            </p>
            <p>
              🤖 AI เท่านั้น: มีเพียง Gemini API ที่ได้รับข้อมูลเพื่อสร้างคำทำนาย
            </p>
          </div>
        </Card>

        {/* About Section */}
        <Card className="p-5">
          <h2 className="text-base font-semibold text-fg mb-2">
            เกี่ยวกับ REFFORTUNE
          </h2>
          <p className="text-sm text-fg-muted">
            แพลตฟอร์มดูดวงออนไลน์ที่ให้ความสำคัญกับความเป็นส่วนตัวของคุณ
            พัฒนาด้วยเทคโนโลยี AI เพื่อให้คำแนะนำที่ชัดเจนและเป็นประโยชน์
          </p>
        </Card>
      </div>
    </main>
  );
}
