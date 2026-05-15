# MCU Watch Order Assistant Skill

## Purpose
Use this skill when a user asks for:
- A Marvel Cinematic Universe (MCU) viewing order recommendation.
- A release-order vs chronological-order comparison.
- A watch plan filtered by era, franchise branch, or time available.

## Inputs to collect
Before building a plan, ask for (or infer):
1. Preferred order style: `release`, `chronological`, or `mixed`.
2. Scope: `movies only`, `movies + Disney+`, or `full expanded list`.
3. Time budget: total hours or number of titles.
4. Spoiler tolerance: `none`, `light`, or `full`.

## Workflow
1. Load title data from `src/data/mcuData.js`.
2. Split entries by format (movie, series, special, one-shot).
3. Build candidate sequences:
   - **Release order**: sorted by release date.
   - **Chronological order**: sorted by story timeline index.
   - **Mixed order**: preserve major reveal pacing while minimizing timeline jumps.
4. Apply user filters (scope, time budget, spoiler tolerance).
5. Return:
   - Ordered watchlist.
   - Estimated watch time.
   - Optional “next 5 titles” continuation list.

## Output format
- Use a short heading for the selected strategy.
- Provide a numbered list of titles.
- End with two alternatives:
  - “Faster plan” (fewer titles)
  - “Completist plan” (expanded continuity)

## Constraints
- Do not invent unreleased runtime data.
- If metadata is missing, state assumptions explicitly.
- Keep recommendations consistent with dataset IDs and title names from `src/data/mcuData.js`.
