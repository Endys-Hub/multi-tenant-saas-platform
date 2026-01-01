FROM node:20-bullseye

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY src ./src
COPY tsconfig.json ./

EXPOSE 4000

CMD ["npm", "run", "dev"]


