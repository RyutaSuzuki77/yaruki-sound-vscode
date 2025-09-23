import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.playSound', () => {
		playSound();
	});
	context.subscriptions.push(disposable);
}

export function playSound() {
	const soundPath = path.join(__dirname, '..', 'media', 'sounds', '001_zundamon_typing_stop.wav');
  	cp.exec(`start ${soundPath}`); // Windowsの場合
}

// This method is called when your extension is deactivated
export function deactivate() {}
