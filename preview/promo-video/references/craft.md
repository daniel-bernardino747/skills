# Craft: what makes these videos look like motion design

Distilled from the /last30days run of 2026-10-01 on "Claude motion-design promo videos". It covered the viral Opus 5.5 showreels, the website-to-video skills (`latent-spaces/brag`), Remotion/HyperFrames tutorials, and the prompt guides that followed them. The plan applies these rules, and the build enforces them.

## The video is code

Every frame is drawn by code (HTML/CSS/GSAP in HyperFrames), and the renderer seeks it frame by frame into an MP4. Nothing comes from a video-generation model. This is why text stays crisp and brand colors stay exact, and why the result can be re-rendered after a one-line fix. Generative video (Higgsfield and similar) is optional b-roll at most, and never carries text or UI.

## Real material, never invented

The single change that turned a generic launch video into a good one, according to the guides, was three lines: the product URL, "use real screenshots and logo instead of making them up", and a soundtrack. So:

- Every screen comes from the capture, the repo, or the user's files.
- No invented features, metrics, testimonials, or logos. A beat with no real material gets cut.
- The brand tokens come from the product (CSS variables, Tailwind theme, capture tokens), not from a preset's default palette.

## Rebuild the UI, don't screen-record it

The clips that read as motion design rebuild the key screens in HTML and animate the parts: cards entering in stagger, numbers counting up, a cursor clicking, the camera pushing into one element. A flat screenshot sliding across the frame reads as a slideshow. Use a screenshot as the reference and for beats in passing; rebuild it on the beats that carry the message.

## Plan before frames

Storyboard with timestamps, then approval, then the build. One-shots go viral, but they are lottery tickets. A beat sheet is what makes the second video as good as the first.

## Hook and rhythm

- The first 3 seconds carry the video: something already moving at frame 0, never a fade from black into a logo.
- One idea per beat. On-screen text: about 4 words per beat, held at least 1.2s per 4 words.
- One motion vocabulary: 2 easings, fixed durations, one transition family. Mixing styles is what makes AI videos look AI.
- The logo lockup and the CTA close the video, not open it.

## Sound sells it

Pick music with a clear pulse and cut on its beats (HyperFrames: beat analysis from `/music-to-video`). Put SFX on the transitions (whoosh, click, pop). A silent motion video feels unfinished even when the frames are good.

## Iterate small

Render, snapshot the scene midpoints, and fix by naming frames ("beat 3 entra 0.4s cedo; segura o card"). Re-render only what changed. Spend the effort where it matters: high effort for a new film, medium for fixes.

## Effort

Every viral one-shot ran at high or max effort. A build from a confirmed plan should too. Fixes and re-renders don't need it.
