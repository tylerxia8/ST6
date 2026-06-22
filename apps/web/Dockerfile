FROM node:22-alpine AS build
WORKDIR /workspace
ARG VITE_API_MODE=mock
ARG VITE_API_BASE_URL=http://localhost:8080/api
ENV VITE_API_MODE=$VITE_API_MODE
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
RUN npm ci --workspace apps/web
COPY apps/web apps/web
WORKDIR /workspace/apps/web
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /workspace/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
