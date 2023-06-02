# -　草刈業務用　資料作成アプリ　-
アルバイト先の草刈り業務で使用するアプリです。<br>
PC操作が苦手な知人の職人を助けるために制作しました。<br>
業務で提出する資料を簡単なフォーム入力で生成し、エクセルファイルとして出力します。

website URL = https://create-documents-for-mowing.vercel.app/

<h3>ディレクトリ構成</h3>
<pre>
.
│  
├── components
│   ├── type
│   │    └──type.ts 
│   ├── CommonForm.tsx
│   ├── ErrorMessage.tsx
│   ├── Forms.tsx
│   ├── LoadingBg.tsx
│   ├── OsButton.tsx
│   ├── TypeOfPlaceButton.tsx
│   └── UploadImage.tsx
├── libs
│   ├── editImage.ts
│   └── exportExcel.ts
├── pages
│ ├── app.tsx
│ └── index.tsx
└── styles
　　 └── globals.css

</pre>

<h3>主要技術</h3>
- Next.js https://nextjs.org/ <br>
- Chakra-ui https://chakra-ui.com/ <br>
- Typescript https://www.typescriptlang.org/ <br>
