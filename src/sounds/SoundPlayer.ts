import { promisify } from 'util';
import * as cp from 'child_process';

const exec = promisify(cp.exec);

class SoundPlayer {
    private isPlaying: boolean = false;
    private isActive: boolean = true;

    setActive(active: boolean) {
        this.isActive = active;
    }

    getActive(): boolean {
        return this.isActive;
    }

    async play(soundPath: string): Promise<void> {
        if (this.isPlaying) return;
        if (!this.isActive) return;
    
        this.isPlaying = true;
        
        const command:string = this.getCommand(soundPath);
        try {
            await exec(command);
        } catch (error) {
            console.error('Error playing sound:', error);
        } finally {
            this.isPlaying = false;
        }
    }

    private getCommand(soundPath: string): string {
        const platform = process.platform;

        if (platform === 'win32') {
            // windows
            return `powershell -c (New-Object Media.SoundPlayer "${soundPath}").PlaySync()`;
        } else if (platform === 'darwin') {
            // mac
            return `afplay "${soundPath}"`;
        } else {
            // linux
            return `play "${soundPath}"`;
        }
    }
}

export default new SoundPlayer();