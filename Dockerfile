# Official Playwright image: browsers and system libraries are preinstalled.
# The tag must match the @playwright/test version in package.json.
FROM mcr.microsoft.com/playwright:v1.65.1-noble

WORKDIR /app
ENV CI=true

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

CMD ["npx", "playwright", "test"]
