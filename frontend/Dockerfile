# Build stage - Use Node 20 instead of 18
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./

# Use npm install instead of npm ci for better compatibility
RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]