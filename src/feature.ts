/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import coc = require("coc.nvim");
import { LanguageClient } from "coc.nvim";
export { LanguageClient } from "coc.nvim";

export interface IFeature extends coc.Disposable {
    setLanguageClient(languageclient: LanguageClient);
    dispose();
}
