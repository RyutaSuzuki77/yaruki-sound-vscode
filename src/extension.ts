import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';

let isPlaying = false;

export function activate(context: vscode.ExtensionContext) {
	let deposable: vscode.Disposable;
	let soundPath: string;

	// エラーだよ。君なら解決できる。
	deposable = vscode.languages.onDidChangeDiagnostics((e) => {
		const diagnostics = vscode.languages.getDiagnostics();

		const hasError = diagnostics.some(([_, diags]) =>
			diags.some(d => d.severity === vscode.DiagnosticSeverity.Error)
		);

		if (hasError) {
			soundPath = path.join(context.extensionPath, 'media', 'sounds', '003_zundamon_error.wav');
			playSound(soundPath);
		}
	});

	// お疲れ。いいペースだよ。
	deposable = vscode.commands.registerCommand('extension.playSound_002_otukare', () => {
		soundPath = path.join(context.extensionPath, 'media', 'sounds', '002_zundamon_otukare.wav');
		playSound(soundPath);
	});

	

	context.subscriptions.push(deposable);
}

function playSound(soundPath: string) {
	if (isPlaying) return;

	isPlaying = true;
	cp.exec(`powershell -c (New-Object Media.SoundPlayer "${soundPath}").PlaySync()`, () =>
		isPlaying = false
	);
}
// This method is called when your extension is deactivated
export function deactivate() {}
