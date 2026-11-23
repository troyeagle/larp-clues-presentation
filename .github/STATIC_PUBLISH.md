# Static output for troyeagle.github.io

`publish-static.yml` uses the existing npm lockfile, tests the clue board UI and
builds with `PUBLIC_URL=/clue`. It does not change application behavior or its
deployment path. Lockfile registry URLs point to public npm while versions and
integrity hashes remain unchanged, so GitHub-hosted runners can install them.

Trusted `main` builds upload `site-clue`. `.github/scripts/package-static.mjs`
records the GitHub build identity and SHA-256 hashes in `_site-sync.json`; the
blog checks this metadata before accepting the output. The metadata file is
not copied into the published application directory.

PRs run tests and a production build, without uploading release artifacts or
receiving the blog notification credential.

After the blog receiver has been installed and its first controlled publish
verified, add a repository secret named `BLOG_DISPATCH_TOKEN`. Use a
fine-grained PAT restricted to **troyeagle/troyeagle.github.io, Actions write**.
The token is used only in a separate notification job with no checkout. It
does not grant Contents write to the blog.

Until that secret is configured, builds still upload their artifacts and the
blog can collect them by schedule or manual dispatch. See the blog repository's
`.github/STATIC_APP_SYNC.md` for receiver credentials, activation and rollback.
