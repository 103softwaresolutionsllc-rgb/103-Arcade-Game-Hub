# 103 Arcade — Game Redo Plan (2026-10-16)

Direction from Isaac: redo all the games — especially the big three — as real games,
not lesson screens. Kids should feel like they are playing, not doing homework.

## What stays, what goes

**Stays (the learning brain — verified deep in the audit):** the three engines
(WordQuest / SpellBuzz / NumBuzz), all curriculum content, per-skill mastery,
grade bands, unlock rules, profiles and saves, the AI coach, and the hub XP
contract. Throwing this away would burn the most valuable, hardest-to-rebuild
part of the project.

**Goes:** the presentation layer of the big three — pages of lesson cards and
forms. Each world is rebuilt as a distinct game genre on top of its engine:

| World | New game | How it plays |
| --- | --- | --- |
| NumBuzz (Math) | **Number Quest** | Adventure map with a winding path; each lesson is a battle against a Number Sprite — every correct answer is a hit, sprites have HP, you have hearts, combos build, world bosses cap each map. |
| WordQuest (Reading) | **Story Quest** | A chapter-book journey: passages become story scenes, questions are story choices, the companion travels with you, chapter bosses gate the next chapter. |
| SpellBuzz (Spelling) | **Spell Caster** | The meadow becomes a spell-dueling garden: hear the word, build it from letter tiles to cast; correct casts bloom the garden and push back the Storm Sprites. |

The five standalone games (FlipMatch, AbcBuzz, SentenceQuest, PatternPop,
RhymeTime) already received the game-feel kit + hub XP wiring in Phase 2 and
stand as the arcade's mini-game tier; they get visual consistency with the new
worlds after the big three land.

## Shared game layer (built once, used by all three)

- Adventure map first, menu second: you always see where you are, what is
  cleared, and what is locked ahead.
- A character on screen who reacts (the Explorer buddy kit from FlipMatch).
- Battles, not forms: answers are actions; enemies have HP; you have hearts.
- Momentum: combo meter, streak bonuses, floating score popups.
- Rewards you can see land: XP/stars from the engine's own reward table,
  treasure moments, node-mastered celebrations — all written through the
  engine so mastery, unlocks, and hub totals stay truthful.
- The AI coach becomes the in-game Hint button after a miss (never gives the
  answer — same kid-safe prompts as the API).

## Order of work

1. **Number Quest** (NumBuzz) — flagship, built first as the template. ✅ in progress
2. **Story Quest** (WordQuest) — same shell pattern, reading mechanics.
3. **Spell Caster** (SpellBuzz) — same shell, letter-tile casting.
4. Hub world cards point at the new games; the classic pages stay reachable
   for parents (placement quiz, PIN, parent zone) until the new shells absorb
   them.
5. Boss mechanics per world (the engines already track boss clears) and
   cosmetics/companions surfaced in the new shells.

## Verification bar

Every rebuilt page: scripts pass syntax checks, all engine calls match the
classic pages' contract (evaluate → reward with lessonKey → mark node
complete → save), a scripted playthrough of a full lesson battle in a DOM
harness, and a local serve check. No page replaces its classic until it
passes; classics remain in the repo as fallback.
