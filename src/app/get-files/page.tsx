import { readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-static";

const FILES = [
  "src/lib/bulk-buy-data.ts",
  "src/components/calculator/shelf-life-tracker.tsx",
  "src/components/calculator/preserving-calculator.tsx",
  "src/components/calculator/bulk-buy-calculator.tsx",
  "src/app/globals.css",
];

async function getFileData() {
  const results = [];
  for (const name of FILES) {
    const content = await readFile(path.join(process.cwd(), name), "utf-8");
    const mime = name.endsWith(".css") ? "text/css" : "text/plain";
    const b64 = Buffer.from(content).toString("base64");
    const href = `data:${mime};charset=utf-8;base64,${b64}`;
    results.push({ name, lines: content.split("\n").length, href, content });
  }
  return results;
}

export default async function PatchDownloadPage() {
  const files = await getFileData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Download Patched Files</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f0eee8;color:#222}.c{max-width:640px;margin:40px auto;padding:0 20px}h1{font-size:22px;margin-bottom:6px}.sub{color:#6b6559;font-size:14px;margin-bottom:28px}.card{background:#fff;border:1px solid #d6d3c8;border-radius:12px;padding:16px 20px;margin-bottom:12px}.ch{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}.fn{font-family:'SF Mono','Fira Code',monospace;font-size:13px;color:#2D5A27;font-weight:600;word-break:break-all}.ln{font-size:12px;color:#a8a29e;white-space:nowrap;margin-left:12px}.br{display:flex;gap:8px}.b{display:inline-block;padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;cursor:pointer;border:none}.bg{background:#2D5A27;color:#fff}.bg:hover{background:#1e3d1a}.bo{background:#fff;color:#2D5A27;border:1.5px solid #2D5A27}.bo:hover{background:#f2f7f0}.note{background:#fff8e1;border:1px solid #ffe082;border-radius:8px;padding:12px 16px;margin-bottom:20px;font-size:13px;color:#6d4c00;line-height:1.5}.note strong{color:#e65100}`,
          }}
        />
      </head>
      <body>
        <div className="c">
          <h1>Patched Files</h1>
          <p className="sub">
            Bulk-buy crash fix, share buttons removed, print labels rebuilt
          </p>
          <div className="note">
            <strong>Important:</strong> Replace each file in GitHub completely.
          </div>
          {files.map((f, i) => (
            <div className="card" key={f.name}>
              <div className="ch">
                <span className="fn">{f.name}</span>
                <span className="ln">{f.lines} lines</span>
              </div>
              <div className="br">
                <a className="b bg" href={f.href} download={f.name.split("/").pop()}>
                  Download
                </a>
                <button className="b bo" data-idx={i}>
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `var fc=${JSON.stringify(files.map((f) => f.content))};document.querySelectorAll('button[data-idx]').forEach(function(b){b.addEventListener('click',function(){var i=+this.getAttribute('data-idx');navigator.clipboard.writeText(fc[i]).then(function(){b.textContent='Copied!';setTimeout(function(){b.textContent='Copy'},1500)})})});`,
          }}
        />
      </body>
    </html>
  );
}
