import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';
import RestTimer from './timers/RestTimer';

let isPlaying: boolean = false;
const restTimeLimit = 1000 * 60 * 60; //1時間
let restTimer: RestTimer;

export function activate(context: vscode.ExtensionContext) {
	let deposable: vscode.Disposable;

	// すごい。1時間経ったよ。休憩も忘れずに。
	restTimer = new RestTimer(restTimeLimit, path.join(context.extensionPath, 'media', 'sounds', '003_zundamon_kyuukei.wav'), playSound);
	restTimer.start();

	// エラーだよ。君なら解決できる。
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
	// お疲れ。いいペースだよ。
	context.subscriptions.push(
		deposable = vscode.commands.registerCommand('extension.playSound_002_otukare', () => {
			const soundPath = path.join(context.extensionPath, 'media', 'sounds', '002_zundamon_otukare.wav');
			playSound(soundPath);
		})
	);
}

function playSound(soundPath: string) {
	if (isPlaying) return;

	isPlaying = true;
	cp.exec(`powershell -c (New-Object Media.SoundPlayer "${soundPath}").PlaySync()`, () =>
		isPlaying = false
	);
}

// This method is called when your extension is deactivated
export function deactivate() {
	restTimer.stop();
}
