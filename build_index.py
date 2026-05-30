#!/usr/bin/env python3
"""Build the private-re-search corpus + index.

Two phases:

  1. pull  — copy pages the research-swarm agent fetched during this session
             (archive files newer than /tmp/re-search-marker) out of the shared
             ~/world_knowledge archive into this repo under sources/, and copy
             this session's run traces into traces/.

  2. build — (re)generate the index from EVERYTHING currently in the repo
             (sources/ + traces/), not just this session's additions. This makes
             the script incremental-safe: run more research, drop a fresh marker,
             re-run, and the index grows instead of resetting.

Generated artifacts:
  - manifest.json   machine-readable index of every page
  - INDEX.md        human-readable index grouped by domain
  - SYNTHESIS.md    merged agent syntheses + cited-but-unfetched refs
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
MARKER = Path(os.environ.get("RE_SEARCH_MARKER", "/tmp/re-search-marker"))

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


def pull_new() -> int:
    """Copy archive pages + run traces newer than the marker into the repo."""
    SOURCES_DIR.mkdir(exist_ok=True)
    TRACES_DIR.mkdir(exist_ok=True)
    if not MARKER.exists():
        print(f"no marker at {MARKER}; skipping pull, building from repo only")
        return 0
    marker_mtime = MARKER.stat().st_mtime
    pulled = 0
    for src in ARCHIVE.rglob("*.md"):
        if src.stat().st_mtime < marker_mtime:
            continue
        dest = SOURCES_DIR / src.parent.name / src.name
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)
        pulled += 1
    for r in RUNS.glob("*.json"):
        if r.stat().st_mtime >= marker_mtime:
            shutil.copy2(r, TRACES_DIR / r.name)
    return pulled


def build() -> None:
    """Regenerate manifest.json / INDEX.md / SYNTHESIS.md from the repo."""
    entries = []
    for src in sorted(SOURCES_DIR.rglob("*.md")):
        text = src.read_text(encoding="utf-8", errors="replace")
        meta = parse_frontmatter(text)
        domain = src.parent.name
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
                "path": str(Path(domain) / src.name),
                "words": wc,
                "blocked": blocked,
            }
        )

    traces = []
    for r in sorted(TRACES_DIR.glob("*.json")):
        data = json.loads(r.read_text(encoding="utf-8", errors="replace"))
        traces.append({"file": r.name, "data": data})

    cited, seen = [], set()
    for t in traces:
        for s in t["data"].get("sources", []):
            if s not in seen:
                seen.add(s)
                cited.append(s)
    fetched_urls = {e["url"].rstrip("/") for e in entries if e["url"]}
    cited_not_fetched = [s for s in cited if s.rstrip("/") not in fetched_urls]

    manifest = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "topic": "IP anonymization for search (+ anonymized scraping / residential proxies)",
        "page_count": len(entries),
        "domain_count": len({e["domain"] for e in entries}),
        "run_count": len(traces),
        "runs": [t["file"] for t in traces],
        "pages": entries,
        "cited_sources": cited,
        "cited_not_fetched_as_file": cited_not_fetched,
    }
    (REPO / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")

    by_domain = {}
    for e in entries:
        by_domain.setdefault(e["domain"], []).append(e)

    blocked_n = sum(1 for e in entries if e["blocked"])
    lines = [
        "# Index — IP Anonymization for Search",
        "",
        f"Corpus pulled from the research-swarm archive (last built "
        f"{datetime.now(timezone.utc).strftime('%Y-%m-%d')}).",
        "",
        f"- **{len(entries)}** raw pages across **{len(by_domain)}** domains "
        f"({blocked_n} marked ⚠️ blocked/empty)",
        f"- **{len(traces)}** agent research runs (see [`traces/`](traces/) and "
        f"[`SYNTHESIS.md`](SYNTHESIS.md))",
        f"- **{len(cited_not_fetched)}** sources cited but not stored as a page "
        f"(arXiv IDs / cache) — listed in [`SYNTHESIS.md`](SYNTHESIS.md)",
        "",
        "See also [`GAPS.md`](GAPS.md) for what the swarm missed, and "
        "[`manifest.json`](manifest.json) for the machine-readable index.",
        "",
        "---",
        "",
    ]
    for domain in sorted(by_domain):
        lines.append(f"## {domain}")
        lines.append("")
        for e in sorted(by_domain[domain], key=lambda x: x["title"].lower()):
            title = e["title"] or e["path"]
            link = f"[{title}]({e['url']})" if e["url"] else title
            flag = " ⚠️ _(fetch blocked / empty)_" if e["blocked"] else ""
            lines.append(f"- {link}{flag}")
            lines.append(f"  - raw: [`sources/{e['path']}`](sources/{e['path']})")
        lines.append("")
    (REPO / "INDEX.md").write_text("\n".join(lines))

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
        gaps = d.get("critique", {}).get("coverage_gaps", [])
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
    n = pull_new()
    print(f"pulled {n} new pages from archive")
    build()
