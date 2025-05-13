require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');

// Notion API 初期化
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

// Notion ページID（URLから抜く32桁の英数字）
const pageId = '1db8e702fb5a8008bfc4d1e02d095e76';

(async () => {
  try {
    // ページ内容をMarkdownブロックに変換
    const mdBlocks = await n2m.pageToMarkdown(pageId);

    // ブロックをMarkdown文字列に変換
    const mdString = n2m.toMarkdownString(mdBlocks).parent;

    // 保存先ファイルパス（カレントディレクトリに保存）
    const outputPath = path.join(__dirname, 'output.md');

    // Markdownファイルとして保存
    fs.writeFileSync(outputPath, mdString, 'utf-8');

    console.log('✅ Markdownファイルを保存しました:', outputPath);
  } catch (err) {
    console.error('❌ エラー:', err.message);
  }
})();
