FROM node:20-alpine

WORKDIR /app

# Chỉ cài package trước để tận dụng cache của Docker
COPY package*.json ./
RUN npm install

# Copy toàn bộ code
COPY . .

# Mở port 4200 (port mặc định Angular)
EXPOSE 4200


# --host 0.0.0.0: 
# --poll 2000: Giúp Docker biết thay đổi
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]