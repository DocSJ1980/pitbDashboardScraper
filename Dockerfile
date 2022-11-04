FROM node:18-alpine
WORKDIR /scraper
RUN npm install pm2 -g
RUN apk update \
  echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
  apk update && \
  apk add --no-cache \
  chromium 
RUN apk add --no-cache tzdata
RUN cp /usr/share/zoneinfo/Asia/Karachi /etc/localtime
COPY package.json .
RUN npm install
COPY . .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
CMD ["pm2-runtime", "index.js", "--max-restarts=100"]