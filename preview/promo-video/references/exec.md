# --exec: build the confirmed plan

The plan is the brief: every creative question was answered in planning, so ask none of them again. Your job is to hand the plan to HyperFrames' launch-video workflow with nothing lost, and to hold the build to [craft.md](craft.md).

## 0. Find and check the plan

- Use the path the user gave. Otherwise look for `promo/*/PLAN.md` in cwd: if there is one, use it; if there are several, ask which.
- `status` must be `confirmed` (or `built`, for a rebuild). With `draft`, or no plan at all, stop and say: *"Esse plano ainda não foi confirmado. Quer terminar o planejamento com `/promo-video`?"*
- Every path in `## Assets` exists. List any missing ones and stop; a missing asset means a beat built from nothing.
- Say in one line that a new build is best run at high effort (craft.md § Effort). Say it once, then continue.

## 1. Install and enter the workflow

```bash
npx hyperframes skills update product-launch-video
```

If it fails, show the error and stop. Do not reconstruct the workflow from memory.

Load `/hyperframes`, then the workflow named in the plan's `workflow:` (normally `/product-launch-video`). Enter the workflow **as if the intent layer had just handed off**: PLAN.md is the confirmed hand-off summary. Tell the workflow, in your own working notes:

- the project directory is `promo/<slug>/video/`, a sibling of the plan. It must not exist yet, because `hyperframes init` refuses a non-empty directory.
- its Setup writes `BRIEF.md` right after `init` by **copying the plan's BRIEF keys** (`workflow` … `narration`) into the frontmatter, and the plan's `## Intent`, `## Assets`, `## Customizations` and `## Notes` into the body. Under `## Customizations`, add one line per beat from `## Beats`, plus the `## Look & Motion` and `## Som` lines.
- the capture already exists (`source.capture`). Reuse it instead of recrawling, unless the workflow needs something it lacks.

From here the workflow drives: frame.md, storyboard, sketches, build, checks.

## 2. Hold the workflow to the plan

The workflow has its own taste. Where it conflicts with the plan, **the plan wins**, because the user confirmed it:

- **Beats are the spine.** The workflow's `STORYBOARD.md` keeps the plan's beat count, timings (±0.3s), order, and on-screen copy **word for word**. The workflow decides how a beat moves, not what it says.
- **Real material only** (craft.md). If the workflow reaches for a stock image, a placeholder, or a made-up number, replace it with the plan's asset or cut that element.
- **Brand from the plan's `## Look & Motion`**, not from a preset palette. When a preset is used, it supplies the layout bones only.
- **Rebuilt UI** on the beats the plan marks for it.
- **Sound** as the plan says: cuts on the beat, SFX on the transitions.

## 3. Checkpoints

With `storyboard: yes` the run is collaborative. At the storyboard and sketch checkpoints, show the plan's beat table next to what the workflow produced, so drift is visible at a glance. Apply only the frames the user names.

Before any render: `npx hyperframes check` must pass, and you snapshot the scene midpoints. Then ask *"renderizar agora, ou o que muda?"* Render only on a yes.

## 4. Close

- Report the MP4 path, its real duration, and a contact sheet of the scene midpoints.
- Update PLAN.md: `status: built`, plus a `## Log` line with the date, output path, and anything that changed during the build. Write any mid-build change of mind back to `## Beats` too, so the plan stays the truth for the next rebuild.
- Offer the cheap next steps: another aspect ratio from the same project (e.g. 9:16 from the 1:1), or a fix pass on named beats.
