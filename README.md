# ocs-example-frontend

This is a frontend project demonstrating use of the ocs-components-lib, and the general capabilities of an observatory control system.

The easiest way to interact with this frontend is to run a full example project with the [ocs_example](https://github.com/observatorycontrolsystem/ocs_example).

## Environment variables

| Variable                              | Description                           | Default                 |
| ------------------------------------- | ------------------------------------- | ----------------------- |
| `VUE_APP_OBSERVATION_PORTAL_API_URL`  | Observation portal API URL            | `http://127.0.0.1:8000` |

## Project setup

Install the frontend dependencies:
```
npm install
```

### Local Development

If you are developing locally, you will need to have a running [observation portal](https://github.com/observatorycontrolsystem/observation-portal). 

Make sure you enable cross origin resource sharing for the frontend domain when running the observation portal. For example, if your frontend is running at `http://127.0.0.1:8080`, you could set the following environment variables for the observation portal:

``` bash
export CORS_ORIGIN_WHITELIST=http://127.0.0.1:8080
export CSRF_TRUSTED_ORIGINS=127.0.0.1:8080
```

Then, to run a hot-reload server for developing on the frontend:
```
npm run serve
```

### Compile and minify for production
```
npm run build
```

### Lint and fix files
```
npm run lint:fix
```

### Check for linting errors without fixing them
```
npm run lint:check
```