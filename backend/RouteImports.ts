// Auth should be first, to prevent showing anything if they're not logged in
import "./Auth/Auth.js";

import "./Nouns/GetNouns.js";
import "./Nouns/PostNouns.js";
import "./Nouns/PatchNouns.js";
import "./Nouns/DeleteNouns.js";

import "./Fields/BatchPostFields.js";

// WebApp should be at the bottom
import "./WebApp/WebApp.js";
