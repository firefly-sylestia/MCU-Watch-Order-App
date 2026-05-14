# Local poster images

Add movie and show poster files in this folder to make the app use local images before it fetches from TMDB.

1. Drop poster files in this directory.
2. Add entries to `posters.json` using either `byId` or `byTitle`.

Example:

```json
{
  "byId": {
    "1": "001-captain-america-the-first-avenger.jpg"
  },
  "byTitle": {
    "Iron Man": "iron-man.jpg"
  }
}
```

Paths can be either filenames in this folder or absolute public paths that start with `/`.
