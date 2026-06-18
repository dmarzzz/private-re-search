"""Load and clean the local web archive into (title, body, url) documents."""
from __future__ import annotations
import os, re, glob
from dataclasses import dataclass

DEFAULT_ROOT = os.path.expanduser("~/world_knowledge/web")
_BLOCK = re.compile(r"just a moment|performing security verification|"
                    r"enable javascript and cookies|attention required", re.I)
_FM = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.S)


@dataclass
class Doc:
    doc_id: int
    url: str
    title: str
    body: str


def _parse(path: str):
    with open(path, "r", errors="ignore") as fh:
        raw = fh.read()
    url, title = "", ""
    m = _FM.match(raw)
    body = raw
    if m:
        fm, body = m.group(1), raw[m.end():]
        for line in fm.splitlines():
            if line.startswith("url:"):
                url = line[4:].strip()
            elif line.startswith("title:"):
                title = line[6:].strip()
    # strip the redundant "Title:/URL Source:/Markdown Content:" jina preamble
    body = re.sub(r"^(Title:.*|URL Source:.*|Published Time:.*|Markdown Content:)\s*$",
                  "", body, flags=re.M)
    return url, title, body.strip()


def load(root: str = DEFAULT_ROOT, min_words: int = 120, limit: int | None = None) -> list[Doc]:
    docs: list[Doc] = []
    paths = sorted(glob.glob(os.path.join(root, "**", "*.md"), recursive=True))
    for path in paths:
        url, title, body = _parse(path)
        if _BLOCK.search(body[:400]) or _BLOCK.search(title):
            continue
        if len(body.split()) < min_words:
            continue
        if not title or title.lower().startswith("just a moment"):
            title = os.path.basename(path)
        docs.append(Doc(doc_id=len(docs), url=url, title=title, body=body))
        if limit and len(docs) >= limit:
            break
    return docs


if __name__ == "__main__":
    d = load()
    print(f"loaded {len(d)} clean docs")
    for x in d[:3]:
        print(f"  [{x.doc_id}] {x.title[:60]!r}  ({len(x.body.split())} words)  {x.url[:50]}")
