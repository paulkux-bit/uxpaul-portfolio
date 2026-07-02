# BARD case study — Theme 1 (Resolutions 01) copy

Axis: how you file. Title: "Every state files differently. One set of filters reads them all."
Each crop ships light + dark. Layout (council): ribbon > band > standard x2 > feature > band.

## Grid captions (glance layer)

- **chip strip (ribbon opener)** — One filter set, every filing. Status, location, event, cause, severity.
- **location band (wide hero)** — One vocabulary reads every state's filings. County or waterbody, the same picker.
- **event (portrait)** — A second axis. What happened, not just where.
- **column picker (portrait)** — The columns everyone shares. Including each state's own case number.
- **map (feature)** — One source, two views. The list and the map never disagree.
- **landing table (band)** — 56 jurisdictions, one table. Every filing normalized into one queryable set.

## PopUp depth (reflection layer, off-grid)

- **Location vocabulary** — The same stretch of water is a county line to one state and a named waterbody to another. The filter indexes both and returns the same set.
- **Event taxonomy** — States report in their own words. The schema maps them to a controlled set, so a query means the same thing in all 56.
- **State Case Number** — No state was asked to give up its own case number. It rides along as an available column, so a record stays traceable to its origin while joining the national set. Keep your filing, still add up.

## Alt text

- `location--chip-strip` — BARD filter bar: Status, Location, Event, Cause, Severity; Location active.
- `location--band-b` — BARD incidents view, location filter open over the table with Florida counties ranked by count.
- `event--card-portrait` — BARD event filter open: grouped event taxonomy (Vessel Impacts, Person and Vessel State) as a portrait tile.
- `columnpicker--portrait` — BARD column picker open over the table: nine visible columns as toggles plus an Available list including State Case Number.
- `map--list-and-map` — BARD map view: left rail of incident cards beside the Florida map with clustered markers; the selected case FL-2026-0438 is highlighted in the rail and opened as a map popover, list and map from one source.
- `landing--result-table` — The resulting Accepted incidents table below the filter bar: nine shared columns (Case ID, Date, Location, Primary Event, Primary Cause, Status, POC, Fatal, Inj) populated across Florida cases.