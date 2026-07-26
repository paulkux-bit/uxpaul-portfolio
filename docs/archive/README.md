# docs/archive

Superseded artifacts kept for the authored content inside them, not for reuse.
Nothing here is imported, and nothing here should be.

## fdte-gate-walk-v1-manifest.json

The v1 cut of the FDT-E gate walk: twelve images with alt text, focal points,
track, slot, and source dimensions. It was extracted from `_to_delete/_fdte-crops.tgz`
before that 11M tarball was dropped.

It is not the source manifest for what shipped. The live one is
`components/case-studies/us-navy-fdt-e/gate-walk-manifest.json`, which carries
eight images. The two sets overlap on only `anomaly--feature.png` and
`verification--band.png`. These ten exist only in the v1 cut:

    activity-feed--tall        baseline-map--feature      order-of-battle--feature
    anomaly--confidence-pill   lineage--popover           response--chat
    anomaly--modal             provenance--band           response--feature
                                                          verification--sources

The PNGs are all regenerable. The raw captures live off-repo on Paul's Desktop at
5760x3240, higher resolution than anything the tarball held. The alt text and focal
points are the part that does not regenerate, which is why this file survives.

Kept here rather than beside `GateWalkBento.tsx`: a second manifest in the component
directory would read as importable, which is the exact confusion the live manifest's
neighbours should not have to resolve.
