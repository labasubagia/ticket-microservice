FROM node:alpine as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .

FROM base AS dev
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base
COPY --from=dev /app/node_modules /app/node_modules
COPY . /app
EXPOSE 3000
CMD [ "pnpm", "start" ]
