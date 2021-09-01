# Kavanet Grafana Dashboard

## Development
Run `dcu` from the root directory  
Make sure the `Interconnector` section of the docker compose file is commented out

## Build & deploy to KavaNetes (from scratch)
1. Run `yarn build` to build the app into something usefull  
2. Run `./bin/push.sh` from the root to create an image of the built app and push it to the KavaNetes registry  
3. Run `kadf` to apply the yaml files to KavaNetes

## Build & deploy to KavaNetes (from update)
1. Run `yarn build` to build the app into something usefull  
2. Run `./bin/push.sh` from the root to create an image of the built app and push it to the KavaNetes registry  
3. Delete the old interconnector pod
