# Feishu Web App (JSAPI) Integration

This project now supports Feishu workbench H5 login bootstrap:

- Client detects Feishu container and requests auth code via JSAPI.
- Server exchanges auth code for Feishu user identity.
- Server stores login state in an HTTP-only session cookie for TanStack Start.

## Required Environment Variables

### Client (`VITE_*`)

- `VITE_FEISHU_APP_ID`: Feishu app id (`cli_...`) used by JSAPI.
- `VITE_FEISHU_SCOPE`: Optional comma-separated scopes. Defaults to `contact:user.base:readonly`.

### Server

- `FEISHU_APP_ID`: Feishu app id (`cli_...`) for code exchange.
- `FEISHU_APP_SECRET`: Feishu app secret.
- `SESSION_SECRET`: Session encryption secret (required in production, recommend 32+ chars).

## API Route

- `POST /api/auth/feishu/session`: exchange `code` and create server session.
- `GET /api/auth/feishu/session`: get current auth status.
- `DELETE /api/auth/feishu/session`: clear current session.

## Frontend Bootstrap Behavior

`FeishuAuthBootstrap` is mounted in `src/routes/__root.tsx`:

1. Detect Feishu/Lark webview via `userAgent`.
2. Skip if already authenticated (`GET /api/auth/feishu/session`).
3. Load Feishu H5 SDK and call `tt.requestAccess`.
4. Fallback to `tt.requestAuthCode` for lower client versions.
5. Send `code` to backend to create HTTP-only session.
