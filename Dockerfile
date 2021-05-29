# 使用 Node 的版本
FROM node:11.10.0

# Node 在容器內的位置
WORKDIR /src

# 複製 package 設定
COPY package.json ./

COPY *.env ./

RUN npm install

# 第一個 . 是我們本地位置，第二個是 docker 裡面專案的位置，就是將我們專案的程式碼全部複製進去
COPY . .

CMD [ "npm", "run", "play" ]
