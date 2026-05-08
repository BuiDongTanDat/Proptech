# ====== Build Angular ======
FROM node:20-alpine AS build 

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN ls -R dist

# ====== Nginx serve ======
FROM nginx:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=build /app/dist/Protech/browser /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]