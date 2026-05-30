#!/usr/bin/env python3
"""Build the private-re-search corpus + index.

Pulls the raw pages that the research-swarm agent fetched during this
research session out of the shared ~/world_knowledge archive, copies them
into this repo under sources/, and generates:

  - sources/<domain>/<slug>.md   raw fetched pages (frontmatter + body)
  - traces/<run>.json            the agent run traces (synthesis + critique)
  - manifest.json                machine-readable index of every source
  - INDEX.md                     human-readable index grouped by domain
  - SYNTHESIS.md                 merged agent syntheses + cited-but-unfetched refs

A page "belongs to this session" if its file mtime is newer than the marker
file written just before the research runs started.
"""
import json
import os
import re
import shutil
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent
ARCHIVE = Path.home() / "world_knowledge" / "web"
RUNS = Path.home() / "shape-rotator-field-kit" / "runs"
MARKER = Path("/tmp/re-search-marker")

SOURCES_DIR = REPO / "sources"
TRACES_DIR = REPO / "traces"


def parse_frontmatter(text: str) -> dict:
    """Pull the YAML-ish frontmatter block (simple key: value lines)."""
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    block = text[3:end].strip("\n")
    meta = {}
    for line in block.splitlines():
        if ":" in line:
            k, _, v = line.partition(":")
            meta[k.strip()] = v.strip()
    return meta


def main() -> None:
    marker_mtime = MARKER.stat().st_mtime
    SOURCES_DIR.mkdir(exist_ok=True)
    TRACES_DIR.mkdir(exist_ok=True)

    # 1. fresh pages from the shared archive
    new_pages = [
        p for p in ARCHIVE.rglob("*.md") if p.stat().st_mtime >= marker_mtime
    ]
    new_pages.sort()

    entries = []
    for src in new_pages:
        text = src.read_text(encoding="utf-8", errors="replace")
        meta = parse_frontmatter(text)
        domain = src.parent.name
        rel = Path(domain) / src.name
        dest = SOURCES_DIR / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)
        # body after the frontmatter, for a rough word count + blocked-fetch flag
        parts = text.split("\n---", 2)
        body = parts[-1] if len(parts) >= 2 else text
        wc = len(re.findall(r"\w+", body))
        title = meta.get("title", src.stem)
        blocked = wc < 60 or any(
            sig in title.lower()
            for sig in ("just a moment", "page not found", "404", "access denied")
        )
        entries.append(
            {
                "domain": domain,
                "title": title,
                "url": meta.get("url", ""),
                "fetched_at": meta.get("fetched_at", ""),
                "extractor": meta.get("extractor", ""),
                "content_hash": meta.get("content_hash", ""),
                "path": str(rel),
                "words": wc,
                "blocked": blocked,
            }
        )

    # 2. run traces from this session
    runs = [p for p in RUNS.glob("*.json") if p.stat().st_mtime >= marker_mtime]
    runs.sort()
    traces = []
    for r in runs:
        shutil.copy2(r, TRACES_DIR / r.name)
        data = json.loads(r.read_text(encoding="utf-8", errors="replace"))
        traces.append({"file": r.name, "data": data})

    # union of all cited sources across runs (urls + arXiv ids)
    cited = []
    seen = set()
    for t in traces:
        for s in t["data"].get("sources", []):
            if s not in seen:
                seen.add(s)
                cited.append(s)

    # which cited sources did we actually archive as a local file?
    fetched_urls = {e["url"] for e in entries if e["url"]}
    cited_not_fetched = [
        s
        for s in cited
        if s not in fetched_urls
        and not any(s.rstrip("/") == e["url"].rstrip("/") for e in entries)
    ]

    # 3. manifest.json
    manifest = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "topic": "IP anonymization for search",
        "page_count": len(entries),
        "domain_count": len({e["domain"] for e in entries}),
        "run_count": len(traces),
        "runs": [t["file"] for t in traces],
        "pages": entries,
        "cited_sources": cited,
        "cited_not_fetched_as_file": cited_not_fetched,
    }
    (REPO / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")

    # 4. INDEX.md grouped by domain
    by_domain = {}
    for e in entries:
        by_domain.setdefault(e["domain"], []).append(e)

    lines = [
        "# Index — IP Anonymization for Search",
        "",
        f"Corpus pulled from the research-swarm archive on "
        f"{datetime.now(timezone.utc).strftime('%Y-%m-%d')}.",
        "",
        f"- **{len(entries)}** raw pages across **{len(by_domain)}** domains "
        f"({sum(1 for e in entries if e['blocked'])} marked ⚠️ blocked/empty)",
        f"- **{len(traces)}** agent research runs (see [`traces/`](traces/) and "
        f"[`SYNTHESIS.md`](SYNTHESIS.md))",
        f"- **{len(cited_not_fetched)}** sources cited but not stored as a page "
        f"(arXiv IDs / cache) — listed in [`SYNTHESIS.md`](SYNTHESIS.md)",
        "",
        "Machine-readable version: [`manifest.json`](manifest.json).",
        "",
        "---",
        "",
    ]
    for domain in sorted(by_domain):
        lines.append(f"## {domain}")
        lines.append("")
        for e in sorted(by_domain[domain], key=lambda x: x["title"].lower()):
            title = e["title"] or e["path"]
            url = e["url"]
            link = f"[{title}]({url})" if url else title
            flag = " ⚠️ _(fetch blocked / empty)_" if e["blocked"] else ""
            lines.append(f"- {link}{flag}")
            lines.append(f"  - raw: [`sources/{e['path']}`](sources/{e['path']})")
        lines.append("")
    (REPO / "INDEX.md").write_text("\n".join(lines))

    # 5. SYNTHESIS.md
    s = ["# Research Syntheses — IP Anonymization for Search", ""]
    for t in traces:
        d = t["data"]
        s.append(f"## {d.get('question', t['file'])}")
        s.append("")
        s.append(f"_Run: `{t['file']}` · grounding "
                 f"{d.get('critique', {}).get('grounding_score', '?')}/5_")
        s.append("")
        s.append(d.get("synthesis", "").strip())
        s.append("")
        crit = d.get("critique", {})
        gaps = crit.get("coverage_gaps", [])
        if gaps:
            s.append("**Coverage gaps flagged by self-critique:**")
            s.extend(f"- {g}" for g in gaps)
            s.append("")
        s.append("---")
        s.append("")
    if cited_not_fetched:
        s.append("## Cited sources not stored as a local page")
        s.append("")
        s.append("(arXiv IDs, PDFs, or pages served from cache — resolve via the URL)")
        s.append("")
        s.extend(f"- `{c}`" for c in cited_not_fetched)
        s.append("")
    (REPO / "SYNTHESIS.md").write_text("\n".join(s))

    print(f"pages={len(entries)} domains={len(by_domain)} runs={len(traces)} "
          f"cited={len(cited)} cited_not_fetched={len(cited_not_fetched)}")


if __name__ == "__main__":
    main()
