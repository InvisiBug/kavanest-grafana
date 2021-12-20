#!/bin/sh


clear && cd helm && helm upgrade grafana . --namespace grafana --create-namespace

EXITCODE=$?
if [ "$EXITCODE" -ne "0" ];
then
echo "
The above error created because the deployment doesn't exist.
Creating deployment now...
"
helm install grafana . --namespace kavanest --create-namespace
fi