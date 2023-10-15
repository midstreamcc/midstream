"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Midstream = void 0;
// const API_URL: string = "https://api.production.midstream.cc";
const API_URL = "http://localhost:7039";
class Midstream {
  constructor(orgId, apiKey) {
    if (!orgId) {
      throw new Error("orgId is required!");
    }
    if (!apiKey) {
      throw new Error("apiKey is required!");
    }
    this.orgId = orgId;
    this.apiKey = apiKey;
  }
  doGet(url) {
    return __awaiter(this, void 0, void 0, function* () {
      const response = yield fetch(`${API_URL}${url}&key=${this.apiKey}`);
      if (!response.ok) throw new Error(response.statusText);
      return yield response.json();
    });
  }
  getVideos(page = 1) {
    return this.doGet(`/api/orgs/${this.orgId}/videos?page=${page}`);
  }
}
exports.Midstream = Midstream;
