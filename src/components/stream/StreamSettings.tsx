import { memo } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

interface StreamSettingsProps {
  ttsEnabled: boolean;
  setTtsEnabled: (enabled: boolean) => void;
  ttsVoice: 'male1' | 'male2' | 'female';
  setTtsVoice: (voice: 'male1' | 'male2' | 'female') => void;
}

export const StreamSettings = memo(({
  ttsEnabled,
  setTtsEnabled,
  ttsVoice,
  setTtsVoice
}: StreamSettingsProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="bg-card/50 backdrop-blur-lg border-primary/30"
        >
          <Icon name="Settings" size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Icon name="Settings" className="text-accent" />
            Настройки стрима
          </DialogTitle>
          <DialogDescription>
            Настройте озвучку донатов и другие параметры
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-bold flex items-center gap-2">
                  <Icon name="Volume2" className="text-accent" />
                  Озвучка донатов
                </Label>
                <p className="text-xs text-muted-foreground">
                  Голосовое объявление суммы и комментария
                </p>
              </div>
              <Switch
                checked={ttsEnabled}
                onCheckedChange={setTtsEnabled}
              />
            </div>
          </Card>

          {ttsEnabled && (
            <Card className="bg-card/50 backdrop-blur-lg border-primary/30 p-4">
              <Label className="text-base font-bold mb-4 block">Выбор голоса</Label>
              <div className="space-y-3">
                <button
                  onClick={() => setTtsVoice('male1')}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    ttsVoice === 'male1' 
                      ? 'border-accent bg-accent/10' 
                      : 'border-primary/30 bg-background/50 hover:bg-background/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      ttsVoice === 'male1' ? 'bg-accent/20' : 'bg-blue-500/20'
                    }`}>
                      <Icon name="User" size={24} className={
                        ttsVoice === 'male1' ? 'text-accent' : 'text-blue-400'
                      } />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-white">Мужской голос 1</p>
                      <p className="text-xs text-muted-foreground">Средний тембр, спокойный</p>
                    </div>
                    {ttsVoice === 'male1' && (
                      <Icon name="CheckCircle" className="ml-auto text-accent" />
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setTtsVoice('male2')}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    ttsVoice === 'male2' 
                      ? 'border-accent bg-accent/10' 
                      : 'border-primary/30 bg-background/50 hover:bg-background/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      ttsVoice === 'male2' ? 'bg-accent/20' : 'bg-purple-500/20'
                    }`}>
                      <Icon name="User" size={24} className={
                        ttsVoice === 'male2' ? 'text-accent' : 'text-purple-400'
                      } />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-white">Мужской голос 2</p>
                      <p className="text-xs text-muted-foreground">Низкий тембр, уверенный</p>
                    </div>
                    {ttsVoice === 'male2' && (
                      <Icon name="CheckCircle" className="ml-auto text-accent" />
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setTtsVoice('female')}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    ttsVoice === 'female' 
                      ? 'border-accent bg-accent/10' 
                      : 'border-primary/30 bg-background/50 hover:bg-background/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      ttsVoice === 'female' ? 'bg-accent/20' : 'bg-pink-500/20'
                    }`}>
                      <Icon name="User" size={24} className={
                        ttsVoice === 'female' ? 'text-accent' : 'text-pink-400'
                      } />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-white">Женский голос</p>
                      <p className="text-xs text-muted-foreground">Высокий тембр, дружелюбный</p>
                    </div>
                    {ttsVoice === 'female' && (
                      <Icon name="CheckCircle" className="ml-auto text-accent" />
                    )}
                  </div>
                </button>
              </div>
            </Card>
          )}

          <div className="bg-background/30 p-3 rounded-lg space-y-2 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={14} className="mt-0.5 text-blue-400" />
              <span>Озвучиваются только донаты от зрителей</span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="Volume2" size={14} className="mt-0.5 text-accent" />
              <span>Формат: "Имя задонатил X бумчиков. Комментарий"</span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="Eye" size={14} className="mt-0.5 text-green-400" />
              <span>Сумма доната видна всем зрителям на экране</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

StreamSettings.displayName = 'StreamSettings';
