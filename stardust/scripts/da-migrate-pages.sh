#!/usr/bin/env bash
set -euo pipefail
cd /Users/gknob/dev/github/gknobloch/www-celinek-org
set -a; . ./.env; set +a
ORG=gknobloch; REPO=www-celinek-org
SK="/Users/gknob/.claude/plugins/cache/adobe-skills/stardust/0.20.0/skills/deploy/scripts"
T=/Users/gknob/.claude/jobs/7951382a/tmp/mig; mkdir -p "$T/src"
HOST="https://www.celinek.org"

PAGES=(index qui-suis-je bienfaits contact realisations prestations-tarifs \
  prestations-tarifs/changement-de-vie prestations-tarifs/vivre-et-vieillir-chez-soi \
  prestations-tarifs/tri-rangement-et-optimisation prestations-tarifs/gerer-sa-maison-pas-a-pas \
  nav footer)

printf "%-46s %-6s %-5s %-8s %s\n" "PATH" "FETCH" "PUT" "FIDELITY" "BLOCKS"
for P in "${PAGES[@]}"; do
  KEY="${P//\//__}"
  LF="$T/src/$KEY.plain.html"; DF="$T/src/$KEY.da.html"; RT="$T/src/$KEY.rt.html"
  FE=$(curl -s -o "$LF" -w "%{http_code}" --compressed "$HOST/$P.plain.html")
  if [ "$FE" != "200" ]; then printf "%-46s %-6s %-5s %-8s %s\n" "$P" "$FE" "-" "-" "(fetch failed)"; continue; fi
  node -e 'const fs=require("fs");const i=fs.readFileSync(process.argv[1],"utf8").trim();fs.writeFileSync(process.argv[2],"<body>\n  <header></header>\n  <main>\n"+i+"\n  </main>\n  <footer></footer>\n</body>\n");' "$LF" "$DF"
  node "$SK/sanitise.js" "$DF" >/dev/null 2>&1
  PC=$(curl -sS -X PUT -H "Authorization: Bearer $DA_TOKEN" -F "data=@$DF;type=text/html" "https://admin.da.live/source/$ORG/$REPO/$P.html" -o /dev/null -w "%{http_code}")
  curl -s -H "Authorization: Bearer $DA_TOKEN" "https://admin.da.live/source/$ORG/$REPO/$P.html" -o "$RT"
  FID=$(node -e '
    const fs=require("fs");
    const ents={rsquo:"’",lsquo:"‘",ldquo:"“",rdquo:"”",amp:"&",lt:"<",gt:">",nbsp:" ",hellip:"…",laquo:"«",raquo:"»",deg:"°"};
    const dec=s=>s.replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(+n)).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCharCode(parseInt(n,16))).replace(/&([a-zA-Z]+);/g,(m,n)=>ents[n]!==undefined?ents[n]:m);
    const norm=s=>dec(s).replace(/<header><\/header>|<footer><\/footer>/g,"").replace(/\s+/g," ").replace(/> </g,"><").trim();
    const mi=s=>{const m=s.match(/<main>([\s\S]*)<\/main>/i);return m?m[1]:s};
    const live=norm(fs.readFileSync(process.argv[1],"utf8"));
    const da=norm(mi(fs.readFileSync(process.argv[2],"utf8")));
    process.stdout.write(live===da?"OK":"DIFF");' "$LF" "$RT")
  BLK=$(node -e 'const fs=require("fs");const h=fs.readFileSync(process.argv[1],"utf8");console.log([...new Set([...h.matchAll(/<div class="([a-z0-9-]+)"/g)].map(m=>m[1]))].join("+")||"default-only")' "$LF")
  printf "%-46s %-6s %-5s %-8s %s\n" "$P" "$FE" "$PC" "$FID" "$BLK"
done
