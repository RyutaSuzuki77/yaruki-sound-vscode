import * as vscode from 'vscode';
import * as path from 'path';
import TriggerTimer from './timers/TriggerTimer';
import SoundPlayer from'./sounds/SoundPlayer';

const restTimeLimit = 1000 * 60 * 60; // 休憩閾値(1時間)
const inputObserverLimit = 1000 * 60 * 5; //入力検知閾値(5分)
const errorLimit = 2; //エラー数閾値(2回)
let restTimer: TriggerTimer;
let inputObserverTimer: TriggerTimer;

export function activate(context: vscode.ExtensionContext) {
	// 起動ON/OFF切り替えトグル
	const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBar.text = '$(unmute) Zundamon ON';
	statusBar.tooltip = 'クリックでサウンドをOFF';
	statusBar.command = 'zundamon.toggleActive';
	statusBar.show();
	context.subscriptions.push(statusBar);
	context.subscriptions.push(
		vscode.commands.registerCommand('zundamon.toggleActive', () => {
			SoundPlayer.setActive(!SoundPlayer.getActive());
			statusBar.text = SoundPlayer.getActive() ? '$(unmute) Zundamon ON' : '$(mute) Zundamon OFF';
			statusBar.tooltip = SoundPlayer.getActive() ? 'クリックでサウンドをOFF' : 'クリックでサウンドをON';
		})
	);

	// 起動音
	SoundPlayer.play(path.join(context.extensionPath, 'media', 'sounds', '005_zundamon_start.wav'));
	
	// 1時間経過
	restTimer = new TriggerTimer(restTimeLimit, path.join(context.extensionPath, 'media', 'sounds', '004_zundamon_kyuukei.wav'), SoundPlayer.play.bind(SoundPlayer));
	restTimer.start();

	// 手が止まってる
	inputObserverTimer = new TriggerTimer(inputObserverLimit, path.join(context.extensionPath, 'media', 'sounds', '001_zundamon_typing_stop.wav'), SoundPlayer.play.bind(SoundPlayer));
	inputObserverTimer.start();
	vscode.workspace.onDidChangeTextDocument(() => {
		inputObserverTimer.reset();
	});

	// エラー発生
	context.subscriptions.push(
		vscode.languages.onDidChangeDiagnostics((e) => {
			const diagnostics = vscode.languages.getDiagnostics();

			const errorCount = diagnostics.reduce((acc, [_, diags]) =>
				acc + diags.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length
			, 0);

			if (errorCount >= errorLimit) {
				const soundPath = path.join(context.extensionPath, 'media', 'sounds', '003_zundamon_error.wav');
				SoundPlayer.play(soundPath);
			}
		})
	);

	// お疲れ
	context.subscriptions.push(
		vscode.commands.registerCommand('zundamon.playSound_002_otukare', () => {
			const soundPath = path.join(context.extensionPath, 'media', 'sounds', '002_zundamon_otukare.wav');
			SoundPlayer.play(soundPath);
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {
	restTimer.stop();
	inputObserverTimer.stop();
	SoundPlayer.play(path.join(__dirname, '..', 'media', 'sounds', '006_zundamon_end.wav'));
}
