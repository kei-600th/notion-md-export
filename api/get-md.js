const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');

// Notion APIクライアントの初期化
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

// NotionのページIDは32桁（ハイフン付きも対応）
function sanitizePageId(id) {
  return id.replace(/-/g, '');
}

module.exports = async (req, res) => {
  const rawPageId = req.query.page;

  if (!rawPageId) {
    return res.status(400).send('Missing "page" query parameter');
  }

  const pageId = sanitizePageId(rawPageId);

  try {
    // NotionページをMarkdownに変換
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdBlocks).parent;

    // ダウンロードさせるようにレスポンスヘッダーを設定
    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="${pageId}.md"`);

    // 本文を返す
    res.status(200).send(mdString);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Failed to fetch Notion page: ${err.message}`);
  }
};
