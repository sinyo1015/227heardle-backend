FROM debian
WORKDIR /src
EXPOSE 80
EXPOSE 443
EXPOSE 3000
ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install curl fonts-freefont-ttf python3 python3-pip ffmpeg -y 
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs
RUN pip3 install yt-dlp

COPY package.json ./
COPY tsconfig.json ./

RUN npm install --loglevel verbose
RUN npm -g i typescript --loglevel verbose
COPY . .
RUN npm run build
CMD ["node", "dist/src/index.js"]