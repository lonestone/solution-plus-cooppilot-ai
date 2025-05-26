FROM node:20-alpine as builder

ENV NODE_ENV build

RUN npm install -g corepack@latest
RUN corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

COPY base/apps/common/.npmrc* base/apps/common/package.json base/apps/common/pnpm-lock.yaml ./base/apps/common/
# COPY cooppilot/apps/common/.npmrc* cooppilot/apps/common/package.json cooppilot/apps/common/pnpm-lock.yaml ./cooppilot/apps/common/
COPY cooppilot/apps/cooppilot-back/.npmrc* cooppilot/apps/cooppilot-back/package.json cooppilot/apps/cooppilot-back/pnpm-lock.yaml ./cooppilot/apps/cooppilot-back/

RUN cd base/apps/common && pnpm fetch
# RUN cd cooppilot/apps/common && pnpm fetch
RUN cd cooppilot/apps/cooppilot-back && pnpm fetch

RUN cd base/apps/common && pnpm install -r --prefer-offline
# RUN cd cooppilot/apps/common && pnpm install -r --prefer-offline
RUN cd cooppilot/apps/cooppilot-back && pnpm install -r --prefer-offline

COPY base/apps/common ./base/apps/common/
# COPY cooppilot/apps/common ./cooppilot/apps/common/
COPY cooppilot/apps/cooppilot-back ./cooppilot/apps/cooppilot-back/
RUN cd cooppilot/apps/cooppilot-back && pnpm prisma generate
RUN cd cooppilot/apps/cooppilot-back && pnpm run build

# ---

FROM node:20-alpine

ENV NODE_ENV production
RUN apk upgrade --update-cache --available && \
    apk add openssl && \
    rm -rf /var/cache/apk/*

WORKDIR /app

COPY --from=builder --chown=node:node /app/base/apps/common/package*.json ./base/apps/common/
COPY --from=builder --chown=node:node /app/base/apps/common/node_modules/ ./base/apps/common/node_modules/
# COPY --from=builder --chown=node:node /app/cooppilot/apps/common/package*.json ./cooppilot/apps/common/
# COPY --from=builder --chown=node:node /app/cooppilot/apps/common/node_modules/ ./cooppilot/apps/common/node_modules/
COPY --from=builder --chown=node:node /app/cooppilot/apps/cooppilot-back/package*.json ./cooppilot/apps/cooppilot-back/
COPY --from=builder --chown=node:node /app/cooppilot/apps/cooppilot-back/node_modules/ ./cooppilot/apps/cooppilot-back/node_modules/
COPY --from=builder /app/cooppilot/apps/cooppilot-back/dist/ ./
COPY cooppilot/apps/cooppilot-back/prisma ./cooppilot/apps/cooppilot-back/prisma/
COPY cooppilot/apps/cooppilot-back/startup.sh ./cooppilot/apps/cooppilot-back/

RUN chmod +x ./cooppilot/apps/cooppilot-back/startup.sh

CMD ["sh", "./cooppilot/apps/cooppilot-back/startup.sh"]
