# iPhone Scroll Verification Notes

- The updated hero uses a single static first frame below 768px and does not create a GSAP pin in that path.
- The mobile hero has `touch-pan-y`, horizontal-only overflow clipping, and decorative layers that ignore pointer input.
- An iPhone-sized preview at 390 × 844 renders the contained Mondo cup frame without a full-screen interactive layer.
- A live preview scroll moved the document from the hero into the next content region after the fallback change.
