/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import path = require("path");
import * as vscode from "../coc_compat";
import { LanguageClient } from "../coc_compat";
import { IFeature } from "../feature";

export class ExamplesFeature implements IFeature {
    private command: vscode.Disposable;
    private examplesPath: string;

    constructor() {
        this.examplesPath = path.resolve(__dirname, "../../../examples");
        this.command = vscode.commands.registerCommand("PowerShell.OpenExamplesFolder", () => {
            vscode.commands.executeCommand(
                "vscode.openFolder",
                vscode.Uri.file(this.examplesPath),
                true);
        });
    }

    public setLanguageClient(languageclient: LanguageClient) {
        // Eliminate tslint warning
    }

    public dispose() {
        this.command.dispose();
    }
}
