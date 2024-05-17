# Node.js-Server

This is a simple template for node.js server


# Typescript 初始環境設定
1. 安裝 typescript 與 express，在專案底下輸入以下指令：
    ```
    npm install --save-dev typescript @types/express @types/node
    npm install --save express
    ```

2. 新增兩個資料夾目錄 dist 與 src 並在 src 裡面新增 index.ts 這個檔案，新增後資料夾結構會如下：
    ```
    project
    
    └───dist
    │   │   
    │   
    └───src
        │   index.ts
    ```

3. 使用以下指令產生 tsconfig.json
    ```
    tsc --init
    ```

4. 打開 tsconfig.json 檔案，設定 outDir 與 rootDir 路徑
    ```
    "outDir": "./dist", //完成編譯後生成 js 文件的路徑                           
    "rootDir": "./src",   //代表 ts 文件的入口路徑
    ```

5. 安裝 nodemon 與 ts-node，使用以下指令
    ```
    npm install --save-dev nodemon ts-node
    ```

6. 在 package.json 中新增以下類別去設定 nodemon

    ( 目的：啟動時會同時將 ts 的檔案自動編譯成 js 檔案，並執行產生出來的 js 檔案。後續只要輸入指令npm start 就會在 dist 的資料夾下產生 index.js 這個檔案並直接執行 )
    ```
    "scripts": {
      "start:build": "tsc -w",  //watch src的ts檔並自動編譯js檔
      "start:run": "nodemon ./dist/index.js", //當有新的js檔產生則去執行
      "start": "npm run start:build && npm run start:run" //執行全部的指令（包含 start:build 及 start:run）
    },
    ```

7. 使用以下指令安裝 prettier 與 eslint
    ```
    npm install --save-dev prettier eslint
    ```

8. 在專案中新增 .prettierrc 與 .eslintrc 檔案

    .prettierrc 檔案內容如下：
    ```
    {
      "semi": false,  //是否句尾添加分號
      "singleQuote": true, //是否使用單引號
      "tabWidth": 2,
      "printWidth": 80
    }
    ```
    .eslintrc 檔案內容如下：
    ```
    {
      "extends": ["eslint:recommended", "plugin:prettier/recommended"],
      "rules": {
        "no-console": "warn",
        "no-unused-vars": "error"
      }
    }
    ```

9. 在專案底下新增 .vscode 檔案並在裡面新增 settings.json，讓設定檔案整合到 vscode 裡面
    ```
    {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
      }
    }
    ```
