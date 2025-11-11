import { memo, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { DonationMessage } from '@/components/types';

interface DonationAlertProps {
  donation: DonationMessage;
  onComplete: () => void;
  voice: 'male1' | 'male2' | 'female';
  ttsEnabled: boolean;
}

export const DonationAlert = memo(({ donation, onComplete, voice, ttsEnabled }: DonationAlertProps) => {
  useEffect(() => {
    if (ttsEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `${donation.username} задонатил ${donation.amount} бумчиков. ${donation.message}`
      );
      
      const voices = speechSynthesis.getVoices();
      
      if (voice === 'male1') {
        utterance.pitch = 0.9;
        utterance.rate = 1.0;
        const ruVoice = voices.find(v => v.lang.includes('ru') && v.name.includes('Male'));
        if (ruVoice) utterance.voice = ruVoice;
      } else if (voice === 'male2') {
        utterance.pitch = 0.7;
        utterance.rate = 0.95;
        const ruVoice = voices.find(v => v.lang.includes('ru') && v.name.includes('Male'));
        if (ruVoice) utterance.voice = ruVoice;
      } else {
        utterance.pitch = 1.2;
        utterance.rate = 1.05;
        const ruVoice = voices.find(v => v.lang.includes('ru') && v.name.includes('Female'));
        if (ruVoice) utterance.voice = ruVoice;
      }
      
      speechSynthesis.speak(utterance);
      
      utterance.onend = () => {
        setTimeout(onComplete, 1000);
      };
    } else {
      setTimeout(onComplete, 5000);
    }
  }, [donation, voice, ttsEnabled, onComplete]);

  return (
    <Card className="fixed top-24 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-accent/95 to-primary/95 backdrop-blur-xl border-accent/50 p-4 min-w-[320px] animate-in slide-in-from-top-5 duration-500">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-3 rounded-full animate-pulse">
          <Icon name="Gift" size={32} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-white text-lg">{donation.username}</span>
            {ttsEnabled && (
              <Icon name="Volume2" size={16} className="text-white animate-pulse" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Coins" size={20} className="text-yellow-300" />
            <span className="font-bold text-yellow-300 text-2xl">{donation.amount} BB</span>
          </div>
          {donation.message && (
            <p className="text-white/90 text-sm mt-2 italic">"{donation.message}"</p>
          )}
        </div>
      </div>
    </Card>
  );
});

DonationAlert.displayName = 'DonationAlert';
