# AGENTS.md

## Cursor Cloud specific instructions

This is the official Flask "flaskr" tutorial blog. The actual application source ships **inside
`flask_blog.zip`** — the update script unzips it to `flask_blog/` on startup. The app runs on
**Python 3.8** (via `uv`) with **Flask 2.2.5**, installed into `flask_blog/.venv`.

- Run the dev server from the unzipped app directory:
  ```
  cd flask_blog
  FLASK_APP=flaskr .venv/bin/flask run --host 0.0.0.0 --port 5000
  ```
  (`FLASK_ENV=development` from the README still works on Flask 2.2 but is deprecated; prefer
  `.venv/bin/flask --app flaskr run --debug`.)
- A seeded SQLite DB ships in `flask_blog/instance/flaskr.sqlite` with a pre-existing login:
  **username `min` / password `0724`**. Use it to log in and create/edit posts.
- Non-obvious: the `/auth/register` handler has a pre-existing typo bug (`error = Nonel`) that
  raises a `NameError` on POST, so registration is broken. Demonstrate auth using the seeded
  `min` account and the login flow instead of registering a new user. (Do not "fix" app code as
  part of environment setup.)
- The unzipped `flask_blog/` directory and its `.venv/` are not tracked and are recreated by the
  update script. Do not commit them.
