import ITimer from './ITimer';

class TriggerTimer implements ITimer {
    private intervalId: NodeJS.Timeout | null = null;
    private startTime: number = Date.now();
    constructor(private limit: number, private soundPath: string, private playSound: (soundPath: string) => void) {}

    start(): void {
        if (this.intervalId) return;

        this.intervalId = setInterval(() => {
            if (Date.now() - this.startTime > this.limit) {
                this.playSound(this.soundPath);
                this.reset();
            }
        }, 1000);
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    reset(): void {
        this.startTime = Date.now();
    }
}

export default TriggerTimer;