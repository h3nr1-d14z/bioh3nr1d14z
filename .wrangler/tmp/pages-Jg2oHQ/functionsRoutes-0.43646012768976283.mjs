import { onRequestGet as __api_avatar_ts_onRequestGet } from "/Volumes/External/Projects/HieuLD/bioh3nr1d14z/functions/api/avatar.ts"
import { onRequestOptions as __api_contact_ts_onRequestOptions } from "/Volumes/External/Projects/HieuLD/bioh3nr1d14z/functions/api/contact.ts"
import { onRequestPost as __api_contact_ts_onRequestPost } from "/Volumes/External/Projects/HieuLD/bioh3nr1d14z/functions/api/contact.ts"
import { onRequestGet as __api_github_ts_onRequestGet } from "/Volumes/External/Projects/HieuLD/bioh3nr1d14z/functions/api/github.ts"
import { onRequestOptions as __api_github_ts_onRequestOptions } from "/Volumes/External/Projects/HieuLD/bioh3nr1d14z/functions/api/github.ts"
import { onRequest as __api_visit_ts_onRequest } from "/Volumes/External/Projects/HieuLD/bioh3nr1d14z/functions/api/visit.ts"

export const routes = [
    {
      routePath: "/api/avatar",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_avatar_ts_onRequestGet],
    },
  {
      routePath: "/api/contact",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_contact_ts_onRequestOptions],
    },
  {
      routePath: "/api/contact",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_contact_ts_onRequestPost],
    },
  {
      routePath: "/api/github",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_github_ts_onRequestGet],
    },
  {
      routePath: "/api/github",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_github_ts_onRequestOptions],
    },
  {
      routePath: "/api/visit",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_visit_ts_onRequest],
    },
  ]