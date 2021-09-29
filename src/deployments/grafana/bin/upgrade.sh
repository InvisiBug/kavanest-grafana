#!/bin/sh

cd helm && helm dependency update && helm upgrade grafana . --namespace grafana --create-namespace