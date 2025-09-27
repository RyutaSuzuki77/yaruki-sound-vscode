import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';
import TriggerTimer from './timers/TriggerTimer';

let isPlaying: boolean = false;
const restTimeLimit = 1000 * 60 * 60; //1時間
const inputObserverLimit = 1000 * 60 * 5; //5分
let restTimer: TriggerTimer;
let inputObserverTimer: TriggerTimer;

export function activate(context: vscode.ExtensionContext) {
	// 1時間経過
	restTimer = new TriggerTimer(restTimeLimit, path.join(context.extensionPath, 'media', 'sounds', '004_zundamon_kyuukei.wav'), playSound);
	restTimer.start();

	// 手が止まってる
	inputObserverTimer = new TriggerTimer(inputObserverLimit, path.join(context.extensionPath, 'media', 'sounds', '001_zundamon_typing_stop.wav'), playSound);
	inputObserverTimer.start();

	// エラー発生
	context.subscriptions.push(
		vscode.languages.onDidChangeDiagnostics((e) => {
			const diagnostics = vscode.languages.getDiagnostics();

			const hasError = diagnostics.some(([_, diags]) =>
				diags.some(d => d.severity === vscode.DiagnosticSeverity.Error)
			);

			if (hasError) {
				const soundPath = path.join(context.extensionPath, 'media', 'sounds', '003_zundamon_error.wav');
				playSound(soundPath);
			}
		})
	);
	// お疲れ
	context.subscriptions.push(
		vscode.commands.registerCommand('extension.playSound_002_otukare', () => {
			const soundPath = path.join(context.extensionPath, 'media', 'sounds', '002_zundamon_otukare.wav');
			playSound(soundPath);
		})
	);

	vscode.workspace.onDidChangeTextDocument(() => {
		inputObserverTimer.reset();
	});
}

function playSound(soundPath: string) {
	if (isPlaying) return;

	isPlaying = true;
	const platform = process.platform;
	let command: string;
	if (platform === 'win32') {
		// windows
		command = `powershell -c (New-Object Media.SoundPlayer "${soundPath}").PlaySync()`;
	} else if (platform === 'darwin') {
		// mac
		command = `afplay "${soundPath}"`;
	} else {
		// linux
		command = `play "${soundPath}"`;
	}

	cp.exec(command, () =>
		isPlaying = false
	);
}

// This method is called when your extension is deactivated
export function deactivate() {
	restTimer.stop();
	inputObserverTimer.stop();
}
