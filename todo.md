# Gallery release checklist

The Copilot Components gallery is live and validated. The site currently generates 17 catalog entries from 18 sample folders; `m365-service-health` is explicitly excluded because it has no `assets/sample.json`.

## Publish

- [x] Create a feature branch from the current local changes, commit them, and open a pull request.
- [x] Confirm the `Validate catalog and site` pull request check passes.
- [x] In **Settings > Pages**, set the source to **GitHub Actions**.
- [x] Merge the pull request to `main` and confirm the `Deploy gallery` workflow succeeds.
- [x] Smoke test <https://pnp.github.io/spfx-copilot-components/>, `catalog.json`, a sample detail page, and an optimized preview.
- [ ] Add `Validate catalog and site` as a required branch-protection check after its first successful pull request run.

## Sample metadata follow-up

These items are not blockers for the live 17-component gallery and require a separate sample-level content pass.

- [ ] Add verified `samples/m365-service-health/assets/sample.json`, referencing one of its existing screenshots as the first ordered image.
- [ ] Audit all sample READMEs, metadata, and gallery media; record accepted exceptions separately if a formal content-quality review is required.
