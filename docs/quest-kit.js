/* quest-kit.js — shared game layer for the quest pages.
   ArcadeSprites: deterministic SVG sprite factory (materials x shapes x faces).
   ArcadeBoss: authored-boss lookup + mastery-remix bosses built from a node's
   own lesson activities, settled through the engines' clearBoss contract. */
(function (global) {
  "use strict";

  function hash(str) {
    let h = 2166136261;
    const s = String(str || "");
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return Math.abs(h);
  }

  /* ---------------- sprite factory ---------------- */
  const MATERIALS = [
    { id: "crystal", adj: "Crystal", g1: "#b8f1ff", g2: "#4f7ddf", edge: "#2c4f9e", pattern: "facets" },
    { id: "slime", adj: "Slime", g1: "#c6ffb0", g2: "#3fae4a", edge: "#22702e", pattern: "gloss" },
    { id: "rock", adj: "Rock", g1: "#cfd4da", g2: "#6d7680", edge: "#454c54", pattern: "cracks" },
    { id: "magma", adj: "Magma", g1: "#5a3a3a", g2: "#241416", edge: "#12090a", pattern: "glowcracks" },
    { id: "ice", adj: "Ice", g1: "#f2feff", g2: "#8fd0e8", edge: "#4d87a3", pattern: "sparkles" },
    { id: "candy", adj: "Candy", g1: "#ffd3ec", g2: "#e86ab0", edge: "#a83a78", pattern: "stripes" },
    { id: "leaf", adj: "Leaf", g1: "#d9f7b0", g2: "#57a83e", edge: "#35701f", pattern: "veins" },
    { id: "shadow", adj: "Shadow", g1: "#8d7cc9", g2: "#3a2a63", edge: "#1d1438", pattern: "mist" },
    { id: "metal", adj: "Metal", g1: "#f4f6f8", g2: "#93a1ad", edge: "#5d6b76", pattern: "rivets" },
    { id: "honey", adj: "Honey", g1: "#ffe9a3", g2: "#e39a1e", edge: "#9c6508", pattern: "hex" }
  ];
  const NOUNS = ["Chomper", "Wobble", "Gnasher", "Bouncer", "Muncher", "Zapper", "Nibbler", "Gobbler"];
  const SHAPES = {
    blob: "M100 18 C 152 18 180 62 180 106 C 180 150 148 180 100 180 C 52 180 20 150 20 106 C 20 62 48 18 100 18 Z",
    spiky: "M100 6 L118 44 L154 22 L152 62 L190 62 L168 94 L198 112 L164 126 L180 162 L142 152 L132 190 L108 158 L82 188 L72 150 L34 164 L46 126 L8 108 L42 92 L24 58 L62 60 L56 20 L88 44 Z",
    orb: "M100 16 C 146 16 182 52 182 98 C 182 144 146 180 100 180 C 54 180 18 144 18 98 C 18 52 54 16 100 16 Z",
    blocky: "M44 26 L156 26 C 172 26 180 34 180 50 L180 142 C 180 164 168 176 146 176 L54 176 C 32 176 20 164 20 142 L20 50 C 20 34 28 26 44 26 Z",
    ghost: "M100 14 C 148 14 174 54 174 102 L174 172 L150 152 L127 172 L103 152 L79 172 L55 152 L31 172 L31 102 C 31 54 52 14 100 14 Z"
  };
  const SHAPE_KEYS = Object.keys(SHAPES);

  function patternMarkup(kind, clipId) {
    const open = '<g clip-path="url(#' + clipId + ')">';
    if (kind === "facets") return open + '<polygon points="100,20 150,90 100,80" fill="#ffffff" opacity="0.28"/><polygon points="100,80 150,90 130,170 84,150" fill="#ffffff" opacity="0.14"/><polygon points="50,60 100,80 84,150 40,130" fill="#000000" opacity="0.10"/></g>';
    if (kind === "gloss") return open + '<ellipse cx="70" cy="58" rx="30" ry="17" fill="#ffffff" opacity="0.4"/><ellipse cx="126" cy="140" rx="20" ry="10" fill="#ffffff" opacity="0.22"/><circle cx="146" cy="66" r="7" fill="#ffffff" opacity="0.35"/></g>';
    if (kind === "cracks") return open + '<polyline points="52,40 78,74 66,104 88,132" fill="none" stroke="#2f353c" stroke-width="3" opacity="0.45"/><polyline points="140,30 128,66 148,96" fill="none" stroke="#2f353c" stroke-width="3" opacity="0.4"/><polyline points="96,160 112,138 104,116" fill="none" stroke="#2f353c" stroke-width="2.5" opacity="0.35"/></g>';
    if (kind === "glowcracks") return open + '<polyline points="48,52 80,84 70,120 96,150" fill="none" stroke="#ff7b00" stroke-width="5" opacity="0.9"/><polyline points="48,52 80,84 70,120 96,150" fill="none" stroke="#ffd23f" stroke-width="2" opacity="0.95"/><polyline points="146,38 132,78 152,112" fill="none" stroke="#ff7b00" stroke-width="4" opacity="0.85"/><polyline points="146,38 132,78 152,112" fill="none" stroke="#ffd23f" stroke-width="1.8" opacity="0.9"/></g>';
    if (kind === "sparkles") return open + '<polygon points="66,44 70,58 84,62 70,66 66,80 62,66 48,62 62,58" fill="#ffffff" opacity="0.85"/><polygon points="140,120 143,131 154,134 143,137 140,148 137,137 126,134 137,131" fill="#ffffff" opacity="0.7"/><polygon points="146,40 148,48 156,50 148,52 146,60 144,52 136,50 144,48" fill="#ffffff" opacity="0.7"/></g>';
    if (kind === "stripes") return open + '<rect x="6" y="66" width="200" height="17" fill="#ffffff" opacity="0.35" transform="rotate(-16 100 100)"/><rect x="6" y="112" width="200" height="13" fill="#ffffff" opacity="0.28" transform="rotate(-16 100 100)"/></g>';
    if (kind === "veins") return open + '<path d="M100 26 C 100 80 100 130 100 172" stroke="#2c5c1c" stroke-width="3.5" fill="none" opacity="0.4"/><path d="M100 70 C 76 62 60 48 52 34 M100 70 C 124 62 140 48 148 34 M100 118 C 78 112 64 100 56 88 M100 118 C 122 112 136 100 144 88" stroke="#2c5c1c" stroke-width="2.5" fill="none" opacity="0.35"/></g>';
    if (kind === "mist") return open + '<ellipse cx="64" cy="158" rx="42" ry="13" fill="#0e0820" opacity="0.35"/><ellipse cx="138" cy="164" rx="36" ry="11" fill="#0e0820" opacity="0.3"/><ellipse cx="100" cy="30" rx="30" ry="9" fill="#ffffff" opacity="0.14"/></g>';
    if (kind === "rivets") return open + '<circle cx="48" cy="48" r="5" fill="#5d6b76" opacity="0.8"/><circle cx="152" cy="48" r="5" fill="#5d6b76" opacity="0.8"/><circle cx="48" cy="150" r="5" fill="#5d6b76" opacity="0.8"/><circle cx="152" cy="150" r="5" fill="#5d6b76" opacity="0.8"/><rect x="30" y="84" width="140" height="9" fill="#ffffff" opacity="0.3"/></g>';
    if (kind === "hex") return open + '<polygon points="60,44 74,52 74,68 60,76 46,68 46,52" fill="none" stroke="#9c6508" stroke-width="2.5" opacity="0.45"/><polygon points="142,108 154,115 154,129 142,136 130,129 130,115" fill="none" stroke="#9c6508" stroke-width="2.5" opacity="0.4"/><polygon points="130,36 140,42 140,54 130,60 120,54 120,42" fill="none" stroke="#9c6508" stroke-width="2" opacity="0.35"/></g>';
    return "";
  }

  function faceMarkup(eyeKind, mouthKind) {
    let eyes = "";
    if (eyeKind === "happy") {
      eyes = '<path d="M52 92 C 60 78 76 78 84 92" fill="none" stroke="#20242a" stroke-width="6" stroke-linecap="round"/><path d="M116 92 C 124 78 140 78 148 92" fill="none" stroke="#20242a" stroke-width="6" stroke-linecap="round"/>';
    } else if (eyeKind === "fierce") {
      eyes = '<path d="M50 66 L88 80" stroke="#20242a" stroke-width="7" stroke-linecap="round"/><path d="M150 66 L112 80" stroke="#20242a" stroke-width="7" stroke-linecap="round"/><ellipse cx="69" cy="94" rx="11" ry="13" fill="#20242a"/><ellipse cx="131" cy="94" rx="11" ry="13" fill="#20242a"/>';
    } else if (eyeKind === "sleepy") {
      eyes = '<path d="M52 90 C 62 98 76 98 86 90" fill="none" stroke="#20242a" stroke-width="5.5" stroke-linecap="round"/><path d="M114 90 C 124 98 138 98 148 90" fill="none" stroke="#20242a" stroke-width="5.5" stroke-linecap="round"/>';
    } else if (eyeKind === "star") {
      eyes = '<polygon points="69,76 73,88 86,88 76,96 80,109 69,101 58,109 62,96 52,88 65,88" fill="#ffb300" stroke="#20242a" stroke-width="2.5"/><polygon points="131,76 135,88 148,88 138,96 142,109 131,101 120,109 124,96 114,88 127,88" fill="#ffb300" stroke="#20242a" stroke-width="2.5"/>';
    } else {
      eyes = '<ellipse cx="69" cy="90" rx="13" ry="16" fill="#ffffff"/><ellipse cx="131" cy="90" rx="13" ry="16" fill="#ffffff"/><circle cx="71" cy="94" r="6.5" fill="#20242a"/><circle cx="129" cy="94" r="6.5" fill="#20242a"/>';
    }
    let mouth = "";
    if (mouthKind === "open") mouth = '<ellipse cx="100" cy="134" rx="17" ry="13" fill="#40222a"/><ellipse cx="100" cy="140" rx="10" ry="5.5" fill="#e86a8a"/>';
    else if (mouthKind === "flat") mouth = '<line x1="80" y1="132" x2="120" y2="132" stroke="#20242a" stroke-width="5.5" stroke-linecap="round"/>';
    else if (mouthKind === "fangs") mouth = '<path d="M72 124 C 84 142 116 142 128 124" fill="none" stroke="#20242a" stroke-width="5.5" stroke-linecap="round"/><polygon points="82,130 90,130 86,142" fill="#ffffff"/><polygon points="110,130 118,130 114,142" fill="#ffffff"/>';
    else mouth = '<path d="M74 122 C 86 142 114 142 126 122 C 114 130 86 130 74 122 Z" fill="#40222a"/><path d="M84 132 C 92 138 108 138 116 132 C 108 135 92 135 84 132 Z" fill="#e86a8a"/>';
    return eyes + mouth;
  }

  function extraMarkup(kind) {
    if (kind === "horns") return '<path d="M44 40 C 30 22 30 8 36 0 C 50 10 56 24 56 40 Z" fill="#f4e3c2" stroke="#b89b62" stroke-width="2.5"/><path d="M156 40 C 170 22 170 8 164 0 C 150 10 144 24 144 40 Z" fill="#f4e3c2" stroke="#b89b62" stroke-width="2.5"/>';
    if (kind === "antenna") return '<path d="M100 16 C 100 4 106 -4 116 -8" stroke="#454c54" stroke-width="4" fill="none"/><circle cx="119" cy="-9" r="8" fill="#ffd23f" stroke="#b8860b" stroke-width="2.5"/>';
    if (kind === "crown") return '<polygon points="62,26 74,2 90,20 100,-2 110,20 126,2 138,26" fill="#ffd23f" stroke="#b8860b" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="12" r="4.5" fill="#ff5d8a"/><circle cx="76" cy="16" r="3.5" fill="#4fc3f7"/><circle cx="124" cy="16" r="3.5" fill="#4fc3f7"/>';
    if (kind === "sprout") return '<path d="M100 18 C 100 8 100 2 100 -4" stroke="#35701f" stroke-width="4"/><path d="M100 2 C 88 -6 76 -4 70 4 C 80 10 94 10 100 2 Z" fill="#57a83e"/><path d="M100 2 C 112 -6 124 -4 130 4 C 120 10 106 10 100 2 Z" fill="#6fbf52"/>';
    if (kind === "wings") return '<ellipse cx="8" cy="102" rx="20" ry="38" fill="#ffffff" opacity="0.75" transform="rotate(24 8 102)"/><ellipse cx="192" cy="102" rx="20" ry="38" fill="#ffffff" opacity="0.75" transform="rotate(-24 192 102)"/>';
    return "";
  }

  let uid = 0;
  function create(opts) {
    opts = opts || {};
    const seed = opts.seed || "sprite";
    const h = hash(seed);
    const mat = MATERIALS[h % MATERIALS.length];
    const shapeKey = SHAPE_KEYS[Math.floor(h / 7) % SHAPE_KEYS.length];
    const eyeKind = opts.boss ? "fierce" : ["round", "happy", "round", "sleepy", "star"][Math.floor(h / 31) % 5];
    const mouthKind = opts.boss ? "fangs" : ["grin", "open", "grin", "flat"][Math.floor(h / 57) % 4];
    const extra = opts.boss ? "crown" : ["none", "horns", "antenna", "sprout", "wings", "none"][Math.floor(h / 91) % 6];
    uid++;
    const gid = "sg" + uid, cid = "sc" + uid;
    const path = SHAPES[shapeKey];
    return '<svg viewBox="-18 -14 236 208" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="sprite">' +
      "<defs>" +
      '<linearGradient id="' + gid + '" x1="0" y1="0" x2="0.7" y2="1"><stop offset="0" stop-color="' + mat.g1 + '"/><stop offset="1" stop-color="' + mat.g2 + '"/></linearGradient>' +
      '<clipPath id="' + cid + '"><path d="' + path + '"/></clipPath>' +
      "</defs>" +
      extraMarkup(extra === "wings" ? "wings" : "none") +
      '<path d="' + path + '" fill="url(#' + gid + ')" stroke="' + mat.edge + '" stroke-width="4"/>' +
      patternMarkup(mat.pattern, cid) +
      (extra !== "wings" ? extraMarkup(extra) : "") +
      faceMarkup(eyeKind, mouthKind) +
      "</svg>";
  }

  function name(seed) {
    const h = hash(seed);
    return MATERIALS[h % MATERIALS.length].adj + " " + NOUNS[Math.floor(h / 13) % NOUNS.length];
  }

  /* ---------------- boss kit ---------------- */
  const BOSS_TITLES = {
    math: ["The Number Menace", "The Equation Eater", "The Digit Dragon", "The Sum Serpent", "The Counting Kraken"],
    reading: ["The Tale Twister", "The Word Wyvern", "The Page Phantom", "The Riddle Roc", "The Chapter Chimera"],
    spelling: ["The Vowel Vandal", "The Spelling Specter", "The Letter Lich", "The Quiet Queller", "The Silent Storm"]
  };
  const BOSS_EMOJI = ["👹", "🐲", "👾", "🦖", "🐙"];

  function remix(node, gameKey, nodeIndex) {
    const acts = [];
    (node.lessons || []).forEach(function (lesson) {
      if (lesson.activities && lesson.activities.length) acts.push(lesson.activities[lesson.activities.length - 1]);
    });
    (node.lessons || []).forEach(function (lesson) {
      (lesson.activities || []).forEach(function (a) {
        if (acts.length < 6 && acts.indexOf(a) === -1) acts.push(a);
      });
    });
    const titles = BOSS_TITLES[gameKey] || BOSS_TITLES.math;
    const i = Math.abs(Number(nodeIndex) || 0);
    return {
      title: titles[i % titles.length],
      blurb: "Mastery challenge — the toughest questions from " + node.name + "!",
      emoji: BOSS_EMOJI[i % BOSS_EMOJI.length],
      reward: { xp: 20, stars: 2 },
      activities: acts.slice(0, 6),
      remix: true
    };
  }

  function forNode(engine, worldId, node, gameKey, nodeIndex) {
    const authored = engine && typeof engine.getBoss === "function" ? engine.getBoss(worldId, node.id) : null;
    if (authored && authored.activities && authored.activities.length) return authored;
    return remix(node, gameKey, nodeIndex);
  }

  global.ArcadeSprites = { create: create, name: name, MATERIALS: MATERIALS };
  global.ArcadeBoss = { forNode: forNode, remix: remix };
})(window);
