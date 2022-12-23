"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const token = core.getInput('token');
const exclude_drafts = core.getInput('exclude_drafts').toLowerCase() === "true";
const client = new github.GitHub(token);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        core.info("Starting update prs");
        const baseBranch = github.context.payload.ref;
        const pullsResponse = yield client.pulls.list(Object.assign(Object.assign({}, github.context.repo), { base: baseBranch, state: 'open' }));
        let prs = pullsResponse.data;
        for (const pr1 of prs.filter(pr => !exclude_drafts || !pr.draft)) {
            try {
                core.info("Updating PR: " + pr1.url);
                yield client.pulls.updateBranch(Object.assign(Object.assign({}, github.context.repo), { pull_number: pr1.number }));
            }
            catch (error) {
                if (error instanceof Error)
                    core.error("Failed to update branch: " + JSON.stringify(error));
            }
        }
    });
}
main().then(r => r);
