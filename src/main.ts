/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

"use strict";

import path = require("path");

import { CodeActionsFeature } from "./features/CodeActions";
import { ConsoleFeature } from "./features/Console";
import { CustomViewsFeature } from "./features/CustomViews";
//import { DebugSessionFeature } from "./features/DebugSession";
//import { PickPSHostProcessFeature } from "./features/DebugSession";
//import { PickRunspaceFeature } from "./features/DebugSession";
//import { SpecifyScriptArgsFeature } from "./features/DebugSession";
import { DocumentFormatterFeature } from "./features/DocumentFormatter";
import { ExamplesFeature } from "./features/Examples";
import { ExpandAliasFeature } from "./features/ExpandAlias";
import { ExtensionCommandsFeature } from "./features/ExtensionCommands";
import { FindModuleFeature } from "./features/FindModule";
import { GenerateBugReportFeature } from "./features/GenerateBugReport";
import { GetCommandsFeature } from "./features/GetCommands";
import { HelpCompletionFeature } from "./features/HelpCompletion";
import { NewFileOrProjectFeature } from "./features/NewFileOrProject";
import { OpenInISEFeature } from "./features/OpenInISE";
import { PesterTestsFeature } from "./features/PesterTests";
import { RemoteFilesFeature } from "./features/RemoteFiles";
import { SelectPSSARulesFeature } from "./features/SelectPSSARules";
import { ShowHelpFeature } from "./features/ShowHelp";
import { Logger, LogLevel } from "./logging";
import { SessionManager } from "./session";
import Settings = require("./settings");
import { PowerShellLanguageId } from "./utils";
import utils = require("./utils");
import { IFeature } from "./feature";

import * as vscode from "./coc_compat"

// The most reliable way to get the name and version of the current extension.
// tslint:disable-next-line: no-var-requires
const PackageJSON: any = require("../../package.json");

// NOTE: We will need to find a better way to deal with the required
//       PS Editor Services version...
const requiredEditorServicesVersion = "2.0.0";

let logger: Logger;
let sessionManager: SessionManager;
let extensionFeatures: IFeature[] = [];

const documentSelector: vscode.DocumentSelector = [
    { language: "powershell", scheme: "file" },
    { language: "powershell", scheme: "untitled" },
];

export function activate(context: vscode.ExtensionContext): void {
    //vscode.languages..(
    //    PowerShellLanguageId,
    //    {
    //        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\=\+\[\{\]\}\\\|\;\'\"\,\.\<\>\/\?\s]+)/g,

    //        indentationRules: {
    //            // ^(.*\*/)?\s*\}.*$
    //            decreaseIndentPattern: /^(.*\*\/)?\s*\}.*$/,
    //            // ^.*\{[^}"']*$
    //            increaseIndentPattern: /^.*\{[^}"']*$/,
    //        },

    //        comments: {
    //            lineComment: "#",
    //            blockComment: ["<#", "#>"],
    //        },

    //        brackets: [
    //            ["{", "}"],
    //            ["[", "]"],
    //            ["(", ")"],
    //        ],

    //        onEnterRules: [
    //            {
    //                // e.g. /** | */
    //                beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
    //                afterText: /^\s*\*\/$/,
    //                action: { indentAction: vscode.IndentAction.IndentOutdent, appendText: " * " },
    //            },
    //            {
    //                // e.g. /** ...|
    //                beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
    //                action: { indentAction: vscode.IndentAction.None, appendText: " * " },
    //            },
    //            {
    //                // e.g.  * ...|
    //                beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
    //                action: { indentAction: vscode.IndentAction.None, appendText: "* " },
    //            },
    //            {
    //                // e.g.  */|
    //                beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
    //                action: { indentAction: vscode.IndentAction.None, removeText: 1 },
    //            },
    //            {
    //                // e.g.  *-----*/|
    //                beforeText: /^(\t|(\ \ ))*\ \*[^/]*\*\/\s*$/,
    //                action: { indentAction: vscode.IndentAction.None, removeText: 1 },
    //            },
    //        ],
    //    });

    // Create the logger
    logger = new Logger();

    // Set the log level
    const extensionSettings = Settings.load();
    logger.MinimumLogLevel = LogLevel[extensionSettings.developer.editorServicesLogLevel];

    sessionManager =
        new SessionManager(
            requiredEditorServicesVersion,
            logger,
            documentSelector,
            PackageJSON.version);

    // Create features
    extensionFeatures = [
        new ConsoleFeature(logger),
        new ExamplesFeature(),
        new OpenInISEFeature(),
        new GenerateBugReportFeature(sessionManager),
        new ExpandAliasFeature(logger),
        new GetCommandsFeature(logger),
        new ShowHelpFeature(logger),
        new FindModuleFeature(),
        new PesterTestsFeature(sessionManager),
        new ExtensionCommandsFeature(logger),
        new SelectPSSARulesFeature(logger),
        new CodeActionsFeature(logger),
        new NewFileOrProjectFeature(),
        new DocumentFormatterFeature(logger, documentSelector),
        new RemoteFilesFeature(),
        //new DebugSessionFeature(context, sessionManager), TODO coc doesn't yet support debugging
        //new PickPSHostProcessFeature(),
        //new SpecifyScriptArgsFeature(context),
        new HelpCompletionFeature(logger),
        new CustomViewsFeature(),
        //new PickRunspaceFeature(),
    ];

    sessionManager.setExtensionFeatures(extensionFeatures);

    if (extensionSettings.startAutomatically) {
        sessionManager.start();
    }
}

export function deactivate(): void {
    // Clean up all extension features
    extensionFeatures.forEach((feature) => {
        feature.dispose();
    });

    // Dispose of the current session
    sessionManager.dispose();

    // Dispose of the logger
    logger.dispose();
}
