# Infrastructure as code

Include Setup GCP with
* Cloud Run
* Artifact registry

## Setup

[Install pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
```bash
npm install
bash ./scripts/ci/dev-deploy.sh
```

## Verify deployment

After execute `dev-deploy.sh`, you will see the following output in console:

```text
ARTIFACT_REGISTRY_URL   europe-west2-docker.pkg.dev/productivity-349522/development-pomodoro-timer-docker-registry
CLOUD_RUN_BACKEND_URL   https://development-pomodoro-timer-cloud-run-backend-serv-ku5iojzg2q-nw.a.run.app
CLOUD_RUN_FRONTEND_RUL  https://development-pomodoro-timer-cloud-run-frontend-ser-ku5iojzg2q-nw.a.run.app
```

In case you missed, execute `pulumi stack output` to see it again.

then you can verify the deployment by running the following steps:

- Open `CLOUD_RUN_FRONTEND_RUL` in a browser

